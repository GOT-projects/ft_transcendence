import { useContext, useState, useEffect, FunctionComponent, useRef } from 'react';
import { StyledLeftPad, StyledLeftPad1alias, StyledBallalias, StyledRightPadalias } from './game/StyleLeftPad';
import {StyledHexaArea, StyledHexaAreaLight} from "./Styles/StyleBackGround"
import { GOT } from '../shared/types';
import {  emitGame } from '../socket/socketEmitGame';
import { SocketContextGame } from '../socket/socketPovider';
import { useNavigate } from 'react-router-dom';
import { onSocketGame } from '../socket/socketOnGame';
import { offSocketGame } from '../socket/socketOffGame';
import tennis from "../assets/tennis.png"
import pong from "../assets/pinpong.png"
import comet from "../assets/comet.png"

enum EnumBall {
	DEFAULT = 'DEFAULT',
	COMET = 'COMET',
	TENIS = 'TENIS',
	PONG = 'PONG',
}


async function useInterval(callback: any, delay: number) {
	const savedCallback: any = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			if (savedCallback.current)
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

async function delay(ms: number) {
	return new Promise( resolve => setTimeout(resolve, ms) );
}


interface IProps {
	profil: GOT.Profile | undefined;
	initGame: undefined | GOT.InitGame;
}

const MousePadLeft:FunctionComponent<IProps> = (props:IProps) => {
	const defaultBall = "https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-blue-red-glowing-round-ball-free-button-image_1370443.jpg";
	const [endGame, setEndGame] = useState(false);
	const [player, setPlayer] = useState<GOT.ActuGamePlayer>();
	const [spec, setSpec] = useState<GOT.ActuGameSpectator>();
	const [point, setPoints] = useState<GOT.ActuGamePoints>({points1: 0, points2: 0});
	const [sizeOfBall, setSizeOfBall] = useState<number>(0);
	const [posPad, setPosPad] = useState<number>(0);
	const [mouseY, setMouseY] = useState<string>('0');
	const [ballX, setBallX] = useState<string>('');
	const [ballY, setBallY] = useState<string>('');
	const [externPadPos, setExternPadPos] = useState<string>('');
	const [externPadPosSpec, setExternPadPosSpec] = useState<string>('');
	const [y, setY] = useState(0);   // pos mouse
	const [tmp, setTmp] = useState(100); // ntm js

	const	table		= document.getElementById("Table");
	const	p1			= document.getElementById("leftpad");
	let		rectpad		= p1?.getBoundingClientRect();
	let		rectable	= table?.getBoundingClientRect(); // pour listen uniquement sur le jeu

	var posActu: number | undefined = undefined;

	const socketGame = useContext(SocketContextGame);
	const navigate = useNavigate();

	// socket in game actualise point
	useEffect(() => {
		onSocketGame.client_game_points(socketGame, setPoints);
		return () => {
			offSocketGame.client_game_points(socketGame);
		}
	}, [socketGame])

	// socket when game is finish
	useEffect(() => {
		onSocketGame.client_game_finish(socketGame, setEndGame).then(() => {
			if (endGame) {
				delay(2000).then(() => {
					navigate('/leaderboard');
				});
			}
		});
		return () => {
			offSocketGame.client_game_finish(socketGame);
		}
	}, [socketGame, endGame, navigate])

	// socket in game actualise data enemy
	useEffect(() => {
		onSocketGame.client_game_player(socketGame, setPlayer);
		return () => {
			offSocketGame.client_game_player(socketGame);
		}
	}, [socketGame])

	// socket in game actualise data for spec
	useEffect(() => {
		onSocketGame.client_game_spec(socketGame, setSpec);
		return () => {
			offSocketGame.client_game_spec(socketGame);
		}
	}, [socketGame])

	// actualisation de la postion du pad joueur
	useEffect(() => {
		if (rectable && rectpad) {
			let val = y - rectable.top;
			if (val < rectpad.height)
				setTmp(rectpad.height);
			else if (val > rectable.height - rectpad.height)
				setTmp(rectable.height - rectpad.height);
			else
				setTmp(val);
			setSizeOfBall(rectpad.height / 4);
		}
	}, [rectable, rectpad, y]);

	useEffect(() => {
		if (rectpad?.height) {
			setSizeOfBall(rectpad.height / 4);
		}
	}, [rectpad?.height]);

	useEffect(() => {
		if (rectable) {
			setPosPad(tmp / rectable.height);
		}
	}, [tmp, rectable]);

	useEffect(() => {
		if (player) {
			setMouseY(tmp.toString());
		}
	}, [tmp, player]);

	useEffect(() => {
		if (rectable) {
			if (player) {
				// Récupération de la coordonnée du pad externe au joueur
				setExternPadPos((rectable.height * player.enemyY + sizeOfBall * 2).toString());
				// Récupération des coordonnées de la balle
				setBallX((player.ball.x * rectable.width - sizeOfBall / 2).toString());
				setBallY((player.ball.y * rectable.height - sizeOfBall / 2).toString());
			}
			else if (spec) {
				setBallX((spec.ball.x * rectable.width - sizeOfBall / 2).toString());
				setBallY((spec.ball.y * rectable.height - sizeOfBall / 2).toString());
				// Récupération de la coordonnée du 1er pad externe au spectateur
				setExternPadPos((rectable.height * spec.player1Y + sizeOfBall * 2).toString());
				// Récupération de la coordonnée du 2eme pad extern du spectateur
				setExternPadPosSpec((rectable.height * spec.player2Y + sizeOfBall * 2).toString());
			}
		}
	}, [spec, player, rectable, sizeOfBall]);

	useEffect(() => {
	}, [spec, rectable, sizeOfBall]);

	// Récupération des coordonnées du pad joueur
	useEffect(() => {
		if (table && props.initGame?.player) {
			table.addEventListener("mousemove", (e) => {
				if (y !== e.pageY) {
					setY(e.pageY);
				}
			});
		}
	}, [table, props.initGame])

	// Envoi des informations du pad joueur
	useInterval(() => {
		if (endGame === false && props.initGame?.player && posActu !== posPad) {
			emitGame.emit_change_pad(socketGame, posPad);
			posActu = posPad;
		}
	}, 33);
	const handleUrl = () => {
		if (props.profil?.userInfos.ball === EnumBall.DEFAULT){
			return defaultBall;
		}else if (props.profil?.userInfos.ball === EnumBall.TENIS){
			return tennis
		}else if (props.profil?.userInfos.ball === EnumBall.COMET){
			return comet
		}else if (props.profil?.userInfos.ball === EnumBall.PONG){
			return pong
		}
	}


	if (props.initGame && point)
		return (
			<div>
				<div style={{position: "absolute", zIndex: "10", top: "13%", opacity: "92%", color: 'white', display: 'flex', fontFamily:'Public Pixel',
							flexDirection: "row", flexWrap: "wrap", justifyContent:'space-between', width: "95%", marginLeft: "2.5%"}}>
					<h2>{point?.points1 + ' - ' + props.initGame.user1.login}</h2>
					<h2>{props.initGame.user2.login + ' - ' + point?.points2}</h2>
				</div>
				<StyledLeftPad id="Table">
					<StyledHexaArea className='grid'/>
					<StyledHexaAreaLight className='light' x="0px" y="0px" />
					{
						(props.initGame?.player && props.profil?.userInfos.email === props.initGame?.user1.email)
						?
							<>
								<StyledLeftPad1alias id="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
								<StyledRightPadalias className="rightpad" y={externPadPos + "px"}></StyledRightPadalias>
							</>
						: ((props.initGame?.player && props.profil?.userInfos.email === props.initGame?.user2.email)
						?
							<>
								<StyledRightPadalias id="leftpad" y={mouseY+"px"}></StyledRightPadalias>
								<StyledLeftPad1alias className="rightpad" y={externPadPos + "px"}></StyledLeftPad1alias>
							</>
						:
							<>
								<StyledLeftPad1alias id="leftpad" y={externPadPos+"px"}></StyledLeftPad1alias>
								<StyledRightPadalias className="rightpad" y={externPadPosSpec + "px"}></StyledRightPadalias>
							</>
						)
					}
					<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"}
									 rot="0px" size={sizeOfBall.toString()+"px"}
									 color={props.profil?.userInfos.color} urlBg={handleUrl()} ></StyledBallalias>
				</StyledLeftPad>
			</div>
		);
	delay(3000).then(() => {
		navigate("/game");
	})
	return (
		<h1 style={{position: "absolute", zIndex: "10", top: "13%", color: "red", textAlign: "center", width: "100%"}}>No game infos</h1>
	);
}
export default MousePadLeft;

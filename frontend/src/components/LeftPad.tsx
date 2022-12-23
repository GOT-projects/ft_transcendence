import { useContext, useState, useEffect, FunctionComponent, useRef } from 'react';
import { StyledLeftPad, StyledLeftPad1alias, StyledBallalias, StyledRightPadalias } from './game/StyleLeftPad';
import {StyledHexaArea, StyledHexaAreaLight} from "./Styles/StyleBackGround"
import { GOT } from '../shared/types';
import {  emitGame } from '../socket/socketEmitGame';
import { SocketContextGame } from '../socket/socketPovider';
import { useNavigate } from 'react-router-dom';
import { onSocketGame } from '../socket/socketOnGame';
import { offSocketGame } from '../socket/socketOffGame';

async function useInterval(callback: any, delay: number) {
	const savedCallback: any = useRef();
	
	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);
	
	// Set up the interval.
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
			//console.log('actu pads joueur')
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
			//console.log('actu pospad');
			setPosPad(tmp / rectable.height);
		}
	}, [tmp, rectable]);

	useEffect(() => {
		if (player) {
			//console.log('update mouse');
			setMouseY(tmp.toString());
		}
	}, [tmp, player]);

	useEffect(() => {
		//console.log('actu ball + pads player')
		if (rectable && player) {
			// Récupération de la coordonnée du pad externe au joueur
			setExternPadPos((rectable.height * player.enemyY + sizeOfBall * 2).toString());
			// Récupération des coordonnées de la balle
			setBallX((player.ball.x * rectable.width - sizeOfBall / 2).toString());
			setBallY((player.ball.y * rectable.height - sizeOfBall / 2).toString());
		}
	}, [player, rectable]);

	useEffect(() => {
		//console.log('actu ball + pads spectateur')
		if (rectable && spec) {
			setBallX((spec.ball.x * rectable.width - sizeOfBall / 2).toString());
			setBallY((spec.ball.y * rectable.height - sizeOfBall / 2).toString());
			// Récupération de la coordonnée du 1er pad externe au spectateur
			setExternPadPos((rectable.height * spec.player1Y + sizeOfBall * 2).toString());
			// Récupération de la coordonnée du 2eme pad extern du spectateur
			setExternPadPosSpec((rectable.height * spec.player2Y + sizeOfBall * 2).toString());
		}
	}, [spec, rectable]);

	// Récupération des coordonnées du pad joueur
	useEffect(() => {
		if (table && props.initGame?.player) {
			//console.log('add event listener');
			table.addEventListener("mousemove", (e) => {
				if (y !== e.pageY) {
					setY(e.pageY);
				}
			});
			/*table.addEventListener("touchmove", (e) => {
				if (y !== e.pageY) {
					setY(e.pageY);
				}
			});*/
		}
	}, [table, props.initGame])

	// Envoi des informations du pad joueur
	useInterval(() => {
		if (endGame === false && props.initGame?.player && posActu !== posPad) {
			emitGame.emit_change_pad(socketGame, posPad);
			posActu = posPad;
		}
	}, 33);
	

	if (props.initGame && point)
		return (
			<div>
				<div style={{position: "absolute", zIndex: "10", top: "13%", opacity: "92%", color: 'white', display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent:'space-between', width: "95%", marginLeft: "2.5%"}}>
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
					<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeOfBall.toString()+"px"}></StyledBallalias>
				</StyledLeftPad>
			</div>
		);
	return (
		<h1>No game infos</h1>
	);
}
export default MousePadLeft;

/*
async function useInterval(callback: any, delay: number) {
	const savedCallback: any = useRef();
	
	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);
	
	// Set up the interval.
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
	player: undefined | GOT.ActuGamePlayer;
    spec: undefined | GOT.ActuGameSpectator;
    point: undefined | GOT.ActuGamePoints;
	endGame: boolean;
}

const MousePadLeft:FunctionComponent<IProps> = (props:IProps) => {
	//const [count, setCount] = useState(0);
	//const [tmp3, setTmp] = useState(0);
	const [y, setY] = useState(0);   // pos mouse

	const socketGame = useContext(SocketContextGame);
    const navigate = useNavigate();
	
	if (props.endGame) {
		delay(2500).then(() => {
			navigate('/leaderboard');
		});
	}
	
	let sizeofball: number = 0;
	var pos_prct: number = 0;
	var ballY: string;
	var ballX: string;
	var mouseY: string;
	var rectable;		// pour listen uniquement sur le jeu
	var rectpad;
	//var rectball;
	var tmp = 100;		// ntm js
	//var tmp2 = 0;
	var rightPadpos: string;
	ballX ="";
	ballY = "";
	rightPadpos = "";

	var table = document.getElementById("Table");
	var p1 = document.getElementById("leftpad");
	var baballe = document.getElementById("ball");
	var pos: number | undefined = undefined;

	useInterval(() => {
		if (props.endGame === false && props.initGame?.player && pos !== pos_prct) {
			emitGame.emit_change_pad(socketGame, pos_prct);
			pos = pos_prct;
		}
	}, 50);

	if (table && props.initGame?.player) {
		table.addEventListener("mousemove", (e) => {
			if (y !== e.pageY) {
				setY(e.pageY);
				//setCount(count + 1);
			}
		});
	}

	if(table && p1 && baballe) {
		
		rectable = table.getBoundingClientRect();
		rectpad = p1.getBoundingClientRect();
		//rectball = baballe.getBoundingClientRect();
		
		tmp = y;
		tmp -= rectable.top;
		
		sizeofball = rectpad.height/3;
		
		if (tmp < rectpad.height){
			tmp = rectpad.height;
		}
		if (tmp > rectable.height - rectpad.height)
			tmp = rectable.height - rectpad.height;

		pos_prct = tmp / rectable.height;
		
	}
	mouseY = tmp.toString();
	if (props.initGame?.player && props.player?.ball.x && props.player?.ball.y && rectable?.width && rectable?.width){
		ballX  = (props.player?.ball.x * rectable?.width).toString();
		ballY  = (props.player?.ball.y * rectable?.height).toString();
	} else if (!(props.initGame?.player) && props.spec?.ball.x && props.spec?.ball.y && rectable?.width && rectable?.width) {
		ballX  = (props.spec?.ball.x * rectable?.width).toString();
		ballY  = (props.spec?.ball.y * rectable?.height).toString();
	}
	if (props.initGame?.player && props.profil?.userInfos.email === props.initGame?.user1.email){
			if (rectable?.height && props.player?.enemyY){
				rightPadpos = (rectable?.height * props.player?.enemyY).toString();
			}
			return (
				<div>
					<div style={{position: "absolute", zIndex: "10", top: "13%", opacity: "92%", color: 'white', display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "95%"}}>
						<h2>{props.point?.points1 + ' - ' + props.initGame.user1.login}</h2>
						<h2>{props.initGame.user2.login + ' - ' + props.point?.points2}</h2>
					</div>
					<StyledLeftPad id="Table">
						<StyledHexaArea className='grid'/>
						<StyledHexaAreaLight className='light' x="0px" y="0px" />
						<StyledLeftPad1alias id="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
						<StyledRightPadalias className="rightpad" y={rightPadpos + "px"}></StyledRightPadalias>
						<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
					</StyledLeftPad>
				</div>)
		}
		else if (props.initGame?.player && props.profil?.userInfos.email === props.initGame?.user2.email){
			if (rectable?.height && props.player?.enemyY){
				rightPadpos = (rectable?.height * props.player?.enemyY).toString(); // left ici
			}
			return (
				<div>
					<div style={{position: "absolute", zIndex: "10", top: "13%", opacity: "92%", color: 'white', display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "95%"}}>
						<h2>{props.point?.points1 + ' - ' + props.initGame.user1.login}</h2>
						<h2>{props.initGame.user2.login + ' - ' + props.point?.points2}</h2>
					</div>
					<StyledLeftPad id="Table">
						<StyledHexaArea className='grid'/>
						<StyledHexaAreaLight className='light' x="0px" y="0px" />
						<StyledRightPadalias id="leftpad" y={mouseY+"px"}></StyledRightPadalias>
						<StyledLeftPad1alias className="rightpad" y={rightPadpos + "px"}></StyledLeftPad1alias>
						<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
					</StyledLeftPad>
				</div>)
		}
		else if (props.initGame) {
			var leftPadPos: string = "";
			if (rectable?.height && props.spec?.player2Y && props.spec?.player1Y){
				leftPadPos = (rectable?.height * props.spec?.player1Y).toString();
				rightPadpos = (rectable?.height * props.spec?.player2Y).toString();
			}
			return (
				<div>
					<div style={{position: "absolute", zIndex: "10", top: "13%", opacity: "92%", color: 'white', display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "95%"}}>
						<h2>{props.point?.points1 + ' - ' + props.initGame.user1.login}</h2>
						<h2>{props.initGame.user2.login + ' - ' + props.point?.points2}</h2>
					</div>
					<StyledLeftPad id="Table">
						<StyledHexaArea className='grid'/>
						<StyledHexaAreaLight className='light' x="0px" y="0px" />
						<StyledLeftPad1alias id="leftpad" y={leftPadPos+"px"}></StyledLeftPad1alias>
						<StyledRightPadalias className="rightpad" y={rightPadpos + "px"}></StyledRightPadalias>
						<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
					</StyledLeftPad>
				</div>)
		}
		return (
			<h1>No game infos</h1>
		)
	
	}
	export default MousePadLeft;
	
*/


	// table = document.getElementById('Table');
	
	// if (table){
	// 	table.addEventListener("mousemove", (e: any) => {
	// 		setY(e.pageY );
	// 	});
	// }





	// const demarre = () => {
	// 	return new Promise((resolve, reject) => {
	// 	var result: test = {table: null,  p1: null, baballe: null};


	// 	result.table = document.getElementById('Table');
	// 	result.baballe = document.getElementById('ball');
	// 	result.p1 = document.getElementById('leftpad');
	// 	console.log(result);
	// 	if(result.table && result.p1 && result.baballe)
	// 		resolve(result);
	// 	else
	// 		reject();

	// 	})
	// }

	// 	demarre().then((result: any) => {
	// 	table = result.table;
	// 	table.addEventListener("mousemove", (e: any) => {
	// 		setY(e.pageY );
	// 	});
	// 	rectable = table.getBoundingClientRect();
	// 	rectpad = result.p1.getBoundingClientRect();
	// 	rectball = result.baballe.getBoundingClientRect();
		
	// 	tmp = y;
	// 	tmp -= rectable.top;
	// 	// pos en %
	// 	pos_prct = tmp / rectable.height * 100;
		
	// 	sizeofball = rectpad.height/3;
		
	// 	if (tmp < rectpad.height){
	// 		tmp = rectpad.height;
	// 	}
	// 	if (tmp > rectable.height - rectpad.height)
	// 		tmp = rectable.height - rectpad.height;
	// }
	// )

	//demarre();

	// if(table && p1 && baballe) {
		
	// 	table.addEventListener("mousemove", (e) => {
	// 		setY(e.pageY );
	// 	});
	// 	rectable = table.getBoundingClientRect();
	// 	rectpad = p1.getBoundingClientRect();
	// 	rectball = baballe.getBoundingClientRect();
		
	// 	tmp = y;
	// 	tmp -= rectable.top;
	// 	// pos en %
	// 	pos_prct = tmp / rectable.height * 100;
		
	// 	sizeofball = rectpad.height/3;
		
	// 	if (tmp < rectpad.height){
	// 		tmp = rectpad.height;
	// 	}
	// 	if (tmp > rectable.height - rectpad.height)
	// 		tmp = rectable.height - rectpad.height;
		
		
		
	// }
	// mouseY = tmp.toString();
	// ballY  = tmp2.toString(); 



	
	// socket.on('onUpdate', (e) => {
	// 	setTmp(e.msg);
	// })
	
	// useInterval(() => {
	// 	socket.emit('updatePlayer', { msg: "lol ca marche pas", from: 'rcuminal' });
	// 	socket.on("connect", () => {
	// 		console.log(socket.connected); // true
	// 	  });
	// 	// socket.off('onUpdate');
	// 	// socket.off('disconnect');
	// 	console.log(tmp3);
	// 	setCount(count + 1);
	// }, 1000);
	
	
//    io  = require('socket.io').listen(app)
	

	
// 	useInterval(() => {
// 		var socket = io.connect('http://localhost:3000');
// 		socket.emit("info",  {
// 			pos: pos_prct,
// 		});
		
// 	}, 50);


	// socket.on("update 2nd player");
	// socket.on("update ball");



//40 64




// const mouseoutLog = document.getElementById('log'),
// red = document.getElementById('red'),
// blue = document.getElementById('blue');

// red.addEventListener('mouseover', overListener);
// red.addEventListener('mouseout', outListener);
// blue.addEventListener('mouseover', overListener);
// blue.addEventListener('mouseout', outListener);

// function outListener(event) {
// let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

// mouseoutLog.innerText = `\nfrom ${event.target.id} into ${related} ${mouseoutLog.innerText}`;
// }

// function overListener(event) {
// let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

// mouseoutLog.innerText = `\ninto ${event.target.id} from ${related} ${mouseoutLog.innerText}`;
// }



// async function useInterval(callback: any, delay: number) {
// 	const savedCallback: any = useRef();
	
// 	// Remember the latest callback.
// 	useEffect(() => {
// 		savedCallback.current = callback;
// 	}, [callback]);
	
// 	// Set up the interval.
// 	useEffect(() => {
// 		function tick() {
// 			if (savedCallback.current)
// 			savedCallback.current();
// 		}
// 		if (delay !== null) {
// 			let id = setInterval(tick, delay);
// 			return () => clearInterval(id);
// 		}
// 	}, [delay]);
		
// }

// type ball = {
// 	x : number,
// 	y : number,
// 	radius: number,
// 	velocityX : number,
// 	velocityY : number,
// 	speed : number,
// 	maph : number,
// 	mapw : number,
// 	ballh : number,
// 	rotate : number,
// };

// function resetBall(ball: ball, width: number, height: number){
//     ball.x = width/2;
//     ball.y = height/2;
//     ball.velocityX = -ball.velocityX;
//     ball.speed = 7;
// }

// async function update(ball: ball, setBall:any){
// 	const newBall = ball;
// 	// if( newBall.x - newBall.radius < 0 ){
//     //     resetBall(newBall, newBall.mapw, newBall.maph);
//     // }else if( newBall.x + newBall.radius > newBall.mapw){
//     //     resetBall(newBall, newBall.mapw, newBall.maph);
//     // }
// 	newBall.x += newBall.velocityX;
// 	newBall.y += newBall.velocityY;
// 	if(newBall.y - newBall.radius + 15 < 0 || newBall.y + newBall.radius > ball.maph - 15){
// 		newBall.velocityY = -newBall.velocityY;
// 		newBall.rotate = +2;
//     }
// 	if(newBall.x - newBall.radius + 15 - 40 < 0 || newBall.x + newBall.radius * 2 >= ball.mapw - 40){
// 		newBall.velocityX = -newBall.velocityX;
// 		newBall.rotate = -2;
//     }
	
// 	setBall(newBall);
// }



// const MousePadLeft = () => {
	
	
// 	const [ball, setBall] = useState({
// 		x : 100,
// 		y : 100,
// 		radius : 10,
// 		velocityX : 1,
// 		velocityY : 1,
// 		speed : 7,
// 		maph : 0,
// 		mapw : 0,
// 		maptop : 0,
// 		ballh : 0,
//         rotate: 90,
// 	});
	
// 	const w = window.innerWidth;
//     const h = window.innerHeight;
//     const sendW = w.toString() + "px";
//     const sendH = h.toString() + "px";
// 	var sendYright: string = "";
// 	let	tmp: number;
// 	var mouseY;
	
// 	const [y, setY] = useState(0);
// 	const [count, setCount] = useState(0);
// 	useInterval(() => {
// 		update(ball, setBall);
// 		setCount(count + 1);
// 	}, 5);
	
// 	useInterval(() => {
// 		document.addEventListener("mousemove", (e) => {
// 			setY(e.pageY - ball.ballh * 1.5);
// 		});
// 	}, 50);
// 	var table = document.querySelector(".Table");
// 	var p1 = document.querySelector(".leftpad");
	
// 	if(table && p1) {
// 		var rect = table.getBoundingClientRect();
// 		var rect1 = p1.getBoundingClientRect();
// 		ball.maptop = rect.top;
// 		ball.mapw = rect.width;
// 		ball.maph = rect.height;
// 		ball.ballh = rect1.height;
		
// 		if (y > rect.height - rect1.height / 2){
// 			tmp = rect.height  - rect1.height / 2;
// 			mouseY = tmp.toString();
// 		}
// 		else if (y <  rect1.height / 2){
// 			tmp =  rect1.height / 2;
// 			mouseY = tmp.toString();
// 		}
// 		else
// 		mouseY = y.toString();		
// 	}
// 	else
// 	console.log("bug");
	
	
// 	var X: number  = ball.x;
//     var Y: number = ball.y;
// 	var Rot: number = ball.rotate;
	
// 	X += 10;
// 	Y += 10;
// 	const sendX = X.toString() + "px";
// 	const sendY = Y.toString() + "px";
// 	const sendRot = "rotate(" + Rot.toString() + "deg)";
// 	if (Y <  ball.maph - ball.ballh / 2  && Y > 0 + ball.ballh / 2){
// 	//	ball.rotate += 2;
// 		Y -= ball.ballh / 2;
// 		sendYright = Y.toString() + "px";
// 	}
// 	else if (Y >=  ball.maph - ball.ballh / 2 ){
// 		Y = ball.maph - ball.ballh;
// 	//	ball.rotate -= 2;
// 		sendYright = Y.toString() + "px";
// 	}
// 	else {
// 		Y = 0;
// 		sendYright = Y.toString() + "px";
// 	}
// 	if (ball.rotate >= 0)
// 		ball.rotate += 2;
// 	else
// 		ball.rotate -= 2;
// 	//var socket = io();
// 	// 	socket.emit("info",  sendY);

// 	// useInterval(() => {
// 	// }, 50);

// 	// socket.on("update 2nd player")
// 	// socket.on("update ball")
// 	return (
// 		<React.Fragment>
// 		<StyledLeftPad className="Table">
// 			<StyledHexaArea className='grid' x="0" y="0" w={sendW} h={sendH}/>
// 			<StyledHexaAreaLight className='light' x={sendX} y={sendY} w={sendW} h={sendH}/>
// 			<StyledLeftPad1alias className="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
// 			<StyledRightPadalias className="rightpad" y={sendYright}></StyledRightPadalias>
// 			<StyledBallalias className="ball"  x={ball.x.toString()+"px"} y={ball.y.toString()+"px"} rot={sendRot}></StyledBallalias>
// 		</StyledLeftPad>
// 	</React.Fragment>	
// 		)
// 	}
// export default MousePadLeft;

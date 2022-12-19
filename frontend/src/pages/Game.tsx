import React, { Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { StyledContenteGame, StyledLoginButton, StyledWaitingContente, StyledWaitingTitle } from '../components/Styles/StylesLogin';
import { GOT } from '../shared/types';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { onSocketGame } from '../socket/socketOnGame';
import {  emitGame } from '../socket/socketEmitGame';
import { offSocketGame } from '../socket/socketOffGame';
import { SocketContextGame } from '../socket/socketPovider';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Game:FunctionComponent<IProps> = (props:IProps)=> {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    let url = (new URL(window.location.href));
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    const id = params.get("id");
    const oldurl = params.get("oldurl");
    const invite = params.get("invite");
    const lastUrl = params.get("lastUrl");
    //TODO need add param last url
    const [waiting, setWating] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [startInit, setStartInit] = useState(false);
    const [game, setGame] = useState(false);
    const [inviteRequest, setInviteRequest] = useState(true);
    const [endGame, setEndGame] = useState(false);
    const [initGame, setInitGame] = useState<GOT.InitGame>()
    const [player, setPlayer] = useState<GOT.ActuGamePlayer>();
    const [spec, setSpec] = useState<GOT.ActuGameSpectator>();
    const [point, setPoints] = useState<GOT.ActuGamePoints>();
    const navigate = useNavigate();
    const socketGame = useContext(SocketContextGame);


    useEffect(() => {
        onSocketGame.client_jwt(socketGame)
    }, [socketGame])

    // socket init game
    useEffect(() => {
        onSocketGame.client_init(socketGame, setInitGame, setStartInit);
        if (startInit){
            setStartInit(false);
            navigate(`/game?code=game&id=${initGame?.codeParty}`)
        }
        return () => {
            offSocketGame.client_init(socketGame);
        }
    }, [socketGame, setInitGame])

    // socket when invite is accepte
    useEffect(() => {
        onSocketGame.client_invite(socketGame, setInviteRequest);
        if (!inviteRequest){
            setInviteRequest(true);
            navigate("/game")
        }
        return () => {
            offSocketGame.client_invite(socketGame);
        }
    }, [socketGame])

    // socket when invite is accepte
    useEffect(() => {
        onSocketGame.client_game_finish(socketGame, setEndGame);
        return () => {
            offSocketGame.client_game_finish(socketGame);
        }
    }, [socketGame])

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

    // socket in game actualise point 
    useEffect(() => {
        onSocketGame.client_game_points(socketGame, setPoints);
        return () => {
            offSocketGame.client_game_points(socketGame);
        }
    }, [socketGame])
    //Socket get erreur from server 
    useEffect(() => {
        onSocketGame.error_client(socketGame, setNotify);
    }, [socketGame])

    //Socket get info from server 
    useEffect(() => {
        onSocketGame.info_client(socketGame, setNotify);
    }, [socketGame])

    //Socket get info from server 
    useEffect(() => {
        onSocketGame.warning_client(socketGame, setNotify)
    }, [socketGame])

    useEffect(() => {
        if (code === "waiting" && id == null){
            console.log("emit join game waiting")
            setWating(true);
            setStartGame(false);
            setGame(false);
            emitGame.emitGameJoinWaing(socketGame);
        }else if (code === "spectator" && id != null){
            console.log("emit join spec")
            setWating(true);
            setStartGame(false);
            setGame(false);
            const parse = parseInt(id);
            if (!isNaN(parse)){
                emitGame.emitjoinSpec(socketGame, parse);
            }
        }else if (code === "waiting" && id != null && invite == null){
            console.log("emit join demande")
            setWating(true);
            setStartGame(false);
            setGame(false);
            emitGame.emitJoinDemand(socketGame, id);
        }else if (code === "waiting" && id != null && invite != null){
            if (invite === "approuve"){
                console.log("emit accept")
                setWating(true);
                setStartGame(false);
                setGame(false);
                emitGame.emitJoinResp(socketGame, id, true);
            }else if (invite === "refused"){
                console.log("emit refused", oldurl)
                setWating(true);
                setStartGame(false);
                setGame(false);
                emitGame.emitJoinResp(socketGame, id, false);
                if (oldurl !== undefined){
                    const route = oldurl?.split("\"");
                    if (route){
                        let ret = route.join(""); 
                        navigate(`${ret}`);
                    }else{
                        navigate(`${oldurl}`);
                    }
                }else{
                    navigate("/leaderboard");
                }
            }
        }else if (code === "game" && id != undefined){
            console.log("game", initGame)
            setStartGame(false);
            setWating(false);
            setGame(true);
        }else{
            setWating(false);
            setStartGame(true);
            setGame(false);
        }
    }, [code, invite, id])

    const handlereturn = () => {
        emitGame.emitLeftWaiting(socketGame);
        navigate("/game");
    }
    const handleStartGame = () => {
        navigate("/game?code=waiting");
    }

	return (
		<React.Fragment>
			<BackgroundAnimate name="game"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuActive} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}
                    profil={props.profil}
                    setProfil={props.setProfil}
                    />
            {waiting ?  <StyledWaitingContente className="Return">
                            <StyledWaitingTitle >Waiting...</StyledWaitingTitle>
                            <StyledLoginButton onClick={handlereturn}>Return</StyledLoginButton>
                        </StyledWaitingContente> : <></>}
            {startGame ?  <StyledContenteGame>
                            <StyledLoginButton onClick={handleStartGame}>Start</StyledLoginButton>
                        </StyledContenteGame> : <></>}
            {game ? <MousePadLeft
                profil={props.profil}
                initGame={initGame}
                player={player}
                spec={spec}
                point={point}
            /> : <></>}
            <Notification notify={notify} setNotify={setNotify}/>
			<Footer/>
		</React.Fragment>
	)
}
export default Game;

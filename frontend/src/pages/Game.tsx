import React, { Dispatch, FunctionComponent, useEffect, useState } from 'react';
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

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Game:FunctionComponent<IProps> = (props:IProps)=> {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    const id = params.get("id");
    const [waiting, setWating] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [game, setGame] = useState(false);
    const navigate = useNavigate();
    const socketGame = io(`${InfoServer.SocketServer}/game` ,{
                withCredentials:false, extraHeaders: {
                "Authorization": "bearer " + localStorage.getItem("token_access"),
    }});

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
        if (code == "waiting" && id == null){
            console.log("emit join game waiting")
            setWating(true);
            setStartGame(false);
            setGame(false);
            emitGame.emitGameJoinWaing(socketGame);
        }else if (code == "waiting" && id != null){
            console.log("emit join demande")
            setWating(true);
            setStartGame(false);
            setGame(false);
            emitGame.emitJoinDemand(socketGame, id);
        }else if (code == "inGame"){
            console.log("in game")
            setStartGame(false);
            setWating(false);
            setGame(true);
        }else{
            setWating(false);
            setStartGame(true);
            setGame(false);
        }
    }, [code])

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
            <Notification notify={notify} setNotify={setNotify}/>
			<Footer/>
		</React.Fragment>
	)
}
export default Game;
// <MousePadLeft />

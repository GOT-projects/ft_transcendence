import React, { Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { SocketContext } from '../socket/socketPovider';
import { StyledContenteGame, StyledLoginButton, StyledWaitingContente, StyledWaitingTitle } from '../components/Styles/StylesLogin';
import { GOT } from '../shared/types';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Game:FunctionComponent<IProps> = (props:IProps)=> {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    const [waiting, setWating] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [game, setGame] = useState(false);
    const navigate = useNavigate();
    const socketGame = io(InfoServer.SocketServer ,{withCredentials:false, extraHeaders: {
                "Authorization": "bearer " + localStorage.getItem("token_access"),
    }});

    useEffect(() => {
        console.log("actual")
        if (code == "waiting"){
            setWating(true);
            setStartGame(false);
            setGame(false);
        }else if (code == "inGame"){
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
            {waiting ?  <StyledWaitingContente>
                            <StyledWaitingTitle>Waiting...</StyledWaitingTitle>
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

import Axios from "../services/Axios";
import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundAnimate from "../components/BackGroundAnimate";
import { Colors } from "../components/Colors";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { InfoServer, UsersId } from "../components/interfaces";
import { StyledChatInput } from "../components/Styles/StyleChat";
import { accountService } from "../services/account.service";
import { useSocketGame } from "../socket/socketPovider";




const Invite = () => {
    const socketGame = useSocketGame();
    socketGame.disconnect();
    const [infoUser, setInfoUser] = useState<UsersId>();
    const [inputChat, setInputChat] = useState("");
    let navigate = useNavigate();
    function handChange(event: any, setInput: any, input: string){
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}
    const PostConnectInvite = async (login:string ) => {
        Axios.defaults.withCredentials = false;
        return await (Axios.post('/auth/invite', { login: login}))
    }
    const send = () => {
        //TODO send to db by socket
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            setInputChat("");
            return;
        }
        const response = PostConnectInvite(inputChat);
	    response.then((response:any) => {
	    	if(response.status === 201){
                accountService.saveToken(response.data.access_token);
                navigate('/leaderboard');
	    	}
	    }).catch((e) =>{
            console.log(e);
        });
    }
    return (
        /*<React.Fragment>
            <BackgroundAnimate name="login"/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuActive} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuDisable}/>*/
            <StyledChatInput style={{backgroundColor:"black", color:"green"}} name='login' placeholder="What's ur login" onChange={(e) => handChange(e, setInputChat, inputChat)} 
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        send();
                                                                                    }}}
                                                                                value={inputChat} autoFocus/>

			/*<Footer/>
        </React.Fragment>*/
    )
}

export default Invite;

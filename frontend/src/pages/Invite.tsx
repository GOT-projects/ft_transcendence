import Axios from "axios";
import React from 'react';
import { useState } from "react";
import BackgroundAnimate from "../components/BackGroundAnimate";
import { Colors } from "../components/Colors";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { InfoServer, UsersId } from "../components/interfaces";
import { StyledChatInput } from "../components/Styles/StyleChat";
import { accountService } from "../services/account.service";




const Invite = () => {
    const [infoUser, setInfoUser] = useState<UsersId>();
    const [inputChat, setInputChat] = useState("");
    function handChange(event: any, setInput: any, input: string){
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}
    const PostConnectInvite = async (login:string ) => {
        Axios.defaults.withCredentials = false;
        return await (Axios.post(InfoServer.HttpServer + '/auth/invite', { login: login}))
    }
    const send = () => {
        //TODO send to db by socket
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            setInputChat("");
            return;
        }
            console.log("start rersponde connect")
            const response = PostConnectInvite(inputChat);
	        response.then((response:any) => {
	        	if(response.status === 201){
                    console.log(response.data);
                    accountService.saveToken(response.data.access_token);
                    setInfoUser(accountService.getInfoUser(response.data.user));
                    window.location.href = '/game';
	        	}
	        }).catch((e) =>{
                console.log(e);
            });
    }
    return (
        /*<React.Fragment>
            <BackgroundAnimate name="login"/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuActive} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuDisable}/>*/
            <StyledChatInput style={{backgroundColor:"black"}} name='login' placeholder="What's ur login" onChange={(e) => handChange(e, setInputChat, inputChat)} 
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        send();
                                                                                    }}}
                                                                                value={inputChat}/>

			/*<Footer/>
        </React.Fragment>*/
    )
}

export default Invite;

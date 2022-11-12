import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {InfoServer, NotifyInter} from "../components/interfaces"
import Axios from "axios"
import { accountService } from "../services/account.service";

const Login = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''})
    const [Url, setUrl] = useState('')
    if (accountService.isLogged() === true){
        console.log("you are log")
        window.location.href = '/game';
    }else{
        Axios.defaults.withCredentials = false;
        try{
	        Axios.get(InfoServer.server + '/auth/getIntraUrl',).then((response:any) => {
	        	setUrl(response.data);
	        })
        }catch(e){
            console.log(e);
        }
    }

    const Contaite = () => {
	    return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton href={Url}>Login Intra</StyledLoginButton>
                <Footer/>
            </StyledLogin>
	    )
    }
	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Contaite></Contaite>
            <Footer/>
            <Notification notify={notify} setNotify={setNotify}/>
        </React.Fragment>
	)
}

export default Login;


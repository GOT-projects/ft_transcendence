import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {NotifyInter} from "../components/interfaces"
import { accountService } from "../services/account.service";
import { apiGet } from "../api/get";

const Login = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''})
    const [Url, setUrl] = useState('')
    if (accountService.isLogged() === true){
        window.location.href = '/game';
    }else{
        const responce = apiGet.getIntraUrl();
        responce.then((rep) => {
            setUrl(rep.data);
        }).catch((e) => {
            console.log(e);
        })
    }

    const Contaite = () => {
	    return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton href={Url} >Login Intra</StyledLoginButton>
                <Footer/>
            </StyledLogin>
	    )
    }
	return (
        <React.Fragment>
            <BackgroundAnimate name="login"/>
            <Contaite></Contaite>
            <Footer/>
            <Notification notify={notify} setNotify={setNotify}/>
        </React.Fragment>
	)
}

export default Login;


import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {InfoServer, NotifyInter} from "../components/interfaces"
import Axios from "axios"

const Login = () => {
    Axios.defaults.withCredentials = false;
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''})
    const [Url, setUrl] = useState('')
	Axios.post(InfoServer.server + '/auth/getUid', {
	    host: InfoServer.client,
	}).then((response:any) => {
		console.log(response.data);
		setUrl(response.data);
	})

    const handleLogin = () => {
        setNotify({isOpen: true, message:'', type:'success'});
    }

    const Contaite = () => {
	    return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton href={Url} onClick={() => handleLogin()}>Login Intra</StyledLoginButton>
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


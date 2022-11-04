import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {InfoServer, NotifyInter, NotifyInterUse} from "../components/interfaces"
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
        setNotify({isOpen: true, message:'Succes Poulet', type:'success'});
        console.log("press", notify)
    }
    console.log(Url)
    const Contaite = () => {
	    return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton to={Url}>Login Intra</StyledLoginButton>
                <button onClick={handleLogin}>click test</button>
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


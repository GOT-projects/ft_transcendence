import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {NotifyInter, NotifyInterUse} from "../components/interfaces"



const Login = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''})
    const handleLogin = () => {
        setNotify({isOpen: true, message:'Succes Poulet', type:'success'});
        console.log("press", notify)
    }

    const Contaite = () => {
	    return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton to="/leaderboard">Login Intra</StyledLoginButton>
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


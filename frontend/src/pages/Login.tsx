import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React from 'react'

const Contaite = () => {
	return (
            <StyledLogin>
			    <StyledLoginLogo height="200px" width="410px" img={Logo}/>			   
                <StyledLoginButton to="/leaderboard">Login Intra</StyledLoginButton>
                <Footer/>
            </StyledLogin>
	)
}

const Login = () => {
	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Contaite></Contaite>
            <Footer/>
        </React.Fragment>
	)
}

export default Login;


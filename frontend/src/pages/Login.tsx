import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";


const Login = () => {
	return (
        <>
            <BackgroundAnimate/>
            <StyledLogin>
			    <StyledLoginLogo height="250px" width="480px" img={Logo}/>			   
                <StyledLoginButton>Login Intra</StyledLoginButton>
            </StyledLogin>
            <Footer/>
        </>
	)
}

export default Login;


import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Footer from "../components/Footer";
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {InfoServer, NotifyInter, NotifyInterUse} from "../components/interfaces"
import Axios from "axios"



const Login = () => {
	Axios.defaults.withCredentials = true;
	const [uid, setUid] = useState<string>('')
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''})
	Axios.get(InfoServer.server + '/auth/getUid', {
	}).then((response:any) => {
		console.log(response);
		// setUid(response.data.message);
	})
    const handleLogin = () => {
        setNotify({isOpen: true, message:'Succes Poulet', type:'success'});
        console.log("press", notify)
    }
	const Url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3d16e8a2e3d93b06015ea5d4fd4b1fa0e72d254b35d175c8beffca317e341af2&redirect_uri=${encodeURI(InfoServer.client)}response_type=code`

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


import React, { useState } from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import { accountService } from '../services/account.service';
import { apiPost } from '../api/post';
import { useNavigate } from 'react-router-dom';
import Popup2FA from '../components/popup/Popup2FA';
import { StyledWaitingContente, StyledWaitingTitle } from '../components/Styles/StylesLogin';

const Waiting = () => {
    const [twoFA, setTwoFA] = useState(true);
    const [twoFAPop, setTwoFAPop] = useState(false);
	const url = window.location.href;
    let navigate = useNavigate();
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    if (!!code){
        try{
            const response = apiPost.PostConnectIntra(code);
	        response.then((response:any) => {
	        	if(response.status === 201){
                    accountService.saveToken(response.data.access_token);
                    if (twoFA){
                        setTwoFAPop(true);
                    }
                    // navigate('/game');
	        	}
	        }).catch((e) =>{
                console.log(e);
                // navigate('/');
            });
        }catch(e){
            console.log(e);
        }
    }else{
        // navigate('/');
    }

	return (
        <React.Fragment>
            <BackgroundAnimate name="waiting"/>
            <StyledWaitingContente>
                <StyledWaitingTitle>Waiting...</StyledWaitingTitle>
            </StyledWaitingContente>
            {twoFAPop ? <Popup2FA/> : <Popup2FA/>}
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


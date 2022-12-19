import React, { useEffect, useState } from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import { accountService } from '../services/account.service';
import { apiPost } from '../api/post';
import { useNavigate } from 'react-router-dom';
import Popup2FA from '../components/popup/Popup2FA';
import { StyledWaitingContente, StyledWaitingTitle } from '../components/Styles/StylesLogin';
import { Notification } from '../components/Notify';
import { NotifyInter } from '../components/interfaces';
import { useSocketGame } from '../socket/socketPovider';

const Waiting = () => {
    const socketGame = useSocketGame();
    socketGame.disconnect();
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [twoFAPop, setTwoFAPop] = useState(false);
	const url = window.location.href;
    let navigate = useNavigate();
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    useEffect(() => {
        if (!!code && !twoFAPop){
        try{
            const response = apiPost.PostConnectIntra(code);
	        response.then((response:any) => {
	        	if(response.status === 201){
                    console.log(response.data.user.isTwoFactorAuthenticationEnabled);
                    accountService.saveToken(response.data.access_token);
                    if (response.data.user.isTwoFactorAuthenticationEnabled){
                            setTwoFAPop(true);
                    }else{
                        navigate('/leaderboard');
                    }
	        	}
	        }).catch((e) =>{
                console.log(e);
                navigate('/');
            });
        }catch(e){
            console.log(e);
        }
    }else{
        navigate('/');
    }
    }, [])

	return (
        <React.Fragment>
            <BackgroundAnimate name="waiting"/>
            {!twoFAPop ? 
            <StyledWaitingContente>
                <StyledWaitingTitle>Waiting...</StyledWaitingTitle>
            </StyledWaitingContente> : <></>}
            {twoFAPop ? <Popup2FA setNotify={setNotify}/> : <></>}
            <Footer/>
            <Notification notify={notify} setNotify={setNotify}/>
        </React.Fragment>
	)
}

export default Waiting;


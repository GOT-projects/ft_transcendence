import React from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import { accountService } from '../services/account.service';
import { apiPost } from '../api/post';
import { useNavigate } from 'react-router-dom';

const Waiting = () => {
	const url = window.location.href;
    let navigate = useNavigate();
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    if (!!code){
            const response = apiPost.PostConnectIntra(code);
	        response.then((response:any) => {
	        	if(response.status === 201){
                    accountService.saveToken(response.data.access_token);
                    navigate('/game');
	        	}
	        }).catch((e) =>{
                navigate('/');
            });
    }else{
        navigate('/');
    }

	return (
        <React.Fragment>
            <BackgroundAnimate name="waiting"/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


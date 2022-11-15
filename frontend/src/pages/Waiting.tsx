import React from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import { accountService } from '../services/account.service';
import { apiPost } from '../api/post';

const Waiting = () => {
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
<<<<<<< HEAD
	//console.log(params.get("code"));
	Axios.post(InfoServer.server + '/auth/connect_intra',
		{ code: params.get("code") }
	).then((response:any) => {
		if(response.status == 201){
			// create cookie with JWT
			/*const cookie = new Cookies();
			cookie.set('jwt', response.data);*/
			console.log(response);
			// Redirect on home page
			//window.location.href = '/';
		}
	});
=======
    const code = params.get("code");
    if (!!code){
            console.log("start rersponde connect")
            const response = apiPost.PostConnectIntra(code);
	        response.then((response:any) => {
	        	if(response.status === 201){
                    accountService.saveToken(response.data.access_token);
                    window.location.href = '/game';
	        	}
	        }).catch((e) =>{
                console.log(e);
            });
    }else{
        window.location.href = '/';
    }

>>>>>>> jo
	return (
        <React.Fragment>
            <BackgroundAnimate name="waiting"/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


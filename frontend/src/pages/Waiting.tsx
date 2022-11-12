import React from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import {InfoServer} from "../components/interfaces"
import Axios from "axios"
import { accountService } from '../services/account.service';

const Waiting = () => {
    Axios.defaults.withCredentials = false;
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
    const code = params.get("code");
    if (!!code){
        try {
	        Axios.post(InfoServer.server + '/auth/connect_intra',
	        	{ code: params.get("code") }
	        ).then((response:any) => {
	        	if(response.status === 201){
                    console.log(response.data)
                    accountService.saveToken(response.data.access_token);
                    window.location.href = '/game';
	        	}
	        });
        } catch (e) {
            console.log(e)
        }
    }else{
        window.location.href = '/';
    }

	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


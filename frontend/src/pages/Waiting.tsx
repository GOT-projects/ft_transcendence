import React, { useState } from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import {InfoServer} from "../components/interfaces"
import Axios from "axios"
import { accountService } from '../services/account.service';
import { useNavigate } from 'react-router-dom';

const Waiting = () => {
    let navigate = useNavigate();
    Axios.defaults.withCredentials = false;
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
	Axios.post(InfoServer.server + '/auth/connect_intra',
		{ code: params.get("code") }
	).then((response:any) => {
		if(response.status === 201){
            console.log(response.data)
            accountService.saveToken(response.data.access_token);
            if (accountService.isLogged() == false){
                console.log("Service waiting ok access to game")
                navigate("/game"); 
            }
		}
	});
	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


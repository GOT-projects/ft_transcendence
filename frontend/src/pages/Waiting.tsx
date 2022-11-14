
import React, { useState } from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import {InfoServer, NotifyInter, NotifyInterUse} from "../components/interfaces"
import Axios from "axios"
import { useSearchParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';




const Waiting = () => {
    Axios.defaults.withCredentials = false;
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
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
	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


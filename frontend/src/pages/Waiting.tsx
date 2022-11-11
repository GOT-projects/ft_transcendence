
import React, { useState } from 'react'
import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import {InfoServer, NotifyInter, NotifyInterUse} from "../components/interfaces"
import Axios from "axios"
import { useSearchParams } from 'react-router-dom';




const Waiting = () => {
    Axios.defaults.withCredentials = false;
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
	//console.log(params.get("code"));
	Axios.post(InfoServer.server + '/auth/connect_intra', {
		withCredentials: true,
	    code: params.get("code"),
	}).then((response:any) => {
		if(response.status == 200){
			//cookieClient.save('cookie-name', response.data, {path:'/'})
		}
		console.log(response);
		console.log('lol');
	})
	return (
        <React.Fragment>
            <BackgroundAnimate/>
            <Footer/>
        </React.Fragment>
	)
}

export default Waiting;


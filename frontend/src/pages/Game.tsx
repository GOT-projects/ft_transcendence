import React, { useEffect, useState } from 'react';
import { StyleHTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from "react-helmet";
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';


const Game = () => {
	
	return (

	
		<React.Fragment>
			<BackgroundAnimate/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuActive} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuDisable}/>

					<MousePadLeft />

			<Footer/>
		</React.Fragment>
	)
}

export default Game;

  
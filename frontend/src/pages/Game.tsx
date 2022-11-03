import React, { useEffect, useState } from 'react';
import { StyleHTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from "react-helmet";
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"


const Game = () => {
	
	return (

	
		<React.Fragment>
			<BackgroundAnimate/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuActive} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuDisable}/>
			<section className="game">
				<canvas id="pong" width="1200" height="800"></canvas>
				<Helmet> <script src="/pong.js" type="text/javascript"/></Helmet>
			</section>
			<Footer/>
		</React.Fragment>
	)
}

export default Game;

  
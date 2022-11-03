import React, { useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"


const Game = () => {
	
	return (
		<React.Fragment>
			<BackgroundAnimate/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuActive} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuDisable}/>
			<Footer/>
		</React.Fragment>
	)
}

export default Game;

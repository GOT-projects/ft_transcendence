import React, { useEffect, useState } from 'react';
import { StyleHTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from "react-helmet";



const Game = () => {
	
	return (
		<section className="game">
			<canvas id="pong" width="1200" height="800"></canvas>
			<Helmet> <script src="/pong.js" type="text/javascript"/></Helmet>
			<li>lol
			</li>
		</section>

	
	)
}

export default Game;

  
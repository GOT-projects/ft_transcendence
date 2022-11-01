import React, { useState } from 'react';
import { StyleHTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import {Helmet} from "react-helmet";


function Welcom() {
	return <h1>Bonjour</h1>;
  }


const Game = () => {
	
	return (
		<div>
			<Welcom somefunction={game} />
		</div>

	
	)
}

export default Game;

  
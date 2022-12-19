import React, { useContext, useState, useEffect, useRef, FunctionComponent } from 'react';
import { StyledLeftPad, StyledLeftPad1alias, StyledLeftPad2, StyledBall, StyledBallalias, StyledRightPadalias } from './game/StyleLeftPad';
import {User} from "./game/User"
import {StyledCursor} from "./Styles/StyleMouse"
import Async from "react-async"
import { useAsync } from "react-async"
import styled from 'styled-components';
import {StyledHexaArea, StyledContainer, StyledGrid, StyledHexaAreaLight} from "./Styles/StyleBackGround"
import BackgroundAnimate from "../components/BackGroundAnimate";
import socketio, { Server } from 'socket.io';
import { io } from "socket.io-client";
import { Request, Response } from 'express';
import { InfoServer } from './interfaces';
import { on } from 'stream';
import { apiGet } from "../api/get";
import { TiArrowMaximiseOutline } from 'react-icons/ti';
import { accountService } from '../services/account.service';
import { ResultType } from '@remix-run/router/dist/utils';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Socket } from "socket.io-client";
import { GOT } from '../shared/types';
import {  emitGame } from '../socket/socketEmitGame';
import { offSocketGame } from '../socket/socketOffGame';
import { SocketContextGame } from '../socket/socketPovider';

async function useInterval(callback: any, delay: number) {
	const savedCallback: any = useRef();
	
	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);
	
	// Set up the interval.
	useEffect(() => {
		function tick() {
			if (savedCallback.current)
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}



interface IProps {
    profil: GOT.Profile | undefined;
	initGame: undefined | GOT.InitGame;
	player: undefined | GOT.ActuGamePlayer;
    spec: undefined | GOT.ActuGameSpectator;
    point: undefined | GOT.ActuGamePoints;
}

const MousePadLeft:FunctionComponent<IProps> = (props:IProps) => {
	const [count, setCount] = useState(0);
	const [tmp3, setTmp] = useState(0);
	const [y, setY] = useState(0);   // pos mouse

	const socketGame = useContext(SocketContextGame);

	let sizeofball: number = 0;
	var pos_prct: number = 0;
	var ballY: string;
	var ballX: string;
	var mouseY: string;
	var rectable;		// pour listen uniquement sur le jeu
	var rectpad;
	var rectball;
	var tmp = 100;		// ntm js
	var tmp2 = 0;
	var rightPadpos: string;
	ballX ="";
	ballY = "";
	rightPadpos = "";

	var table = document.getElementById("Table");
	var p1 = document.getElementById("leftpad");
	var baballe = document.getElementById("ball");

	// useInterval(() => {

	// 	setCount(count + 1);
	// }, 1000);


	if (table){
	table.addEventListener("mousemove", (e) => {
		setY(e.pageY );
		setCount(count + 1);
	});}

	if(table && p1 && baballe) {
		
		rectable = table.getBoundingClientRect();
		rectpad = p1.getBoundingClientRect();
		rectball = baballe.getBoundingClientRect();
		
		tmp = y;
		tmp -= rectable.top;
		
		sizeofball = rectpad.height/3;
		
		if (tmp < rectpad.height){
			tmp = rectpad.height;
		}
		if (tmp > rectable.height - rectpad.height)
			tmp = rectable.height - rectpad.height;
		
		pos_prct = tmp / rectable.height;
		
	}
	mouseY = tmp.toString();
	if (props.player?.ball.x && props.player?.ball.y && rectable?.width && rectable?.width){
		ballX  = (props.player?.ball.x * rectable?.width).toString();
		ballY  = (props.player?.ball.y * rectable?.height).toString();
	}
	if (props.profil?.userInfos.login === props.initGame?.user1.login){
		emitGame.emit_change_pad(socketGame, pos_prct);
		if (rectable?.height && props.player?.enemyY){
			rightPadpos = (rectable?.height * props.player?.enemyY).toString();
//			console.log("=====> otstring %D", props.player.enemyY);
		}
		return (
			<StyledLeftPad id="Table">
				<StyledHexaArea className='grid'/>
				<StyledHexaAreaLight className='light' x="0px" y="0px" />
				<StyledLeftPad1alias id="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
				<StyledRightPadalias className="rightpad" y={rightPadpos + "px"}></StyledRightPadalias>
				<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
			</StyledLeftPad>)
	}
	else if (props.profil?.userInfos.login === props.initGame?.user2.login){
		emitGame.emit_change_pad(socketGame, pos_prct);
		if (rectable?.height && props.player?.enemyY){
			rightPadpos = (rectable?.height * props.player?.enemyY).toString(); // left ici
		}
		return (
			<StyledLeftPad id="Table">
				<StyledHexaArea className='grid'/>
				<StyledHexaAreaLight className='light' x="0px" y="0px" />
				<StyledRightPadalias id="leftpad" y={mouseY+"px"}></StyledRightPadalias>
				<StyledLeftPad1alias className="rightpad" y={rightPadpos + "px"}></StyledLeftPad1alias>
				<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
			</StyledLeftPad>)
	}
	else {
		var leftPadPos: string = "";
		if (rectable?.height && props.spec?.player2Y && props.spec?.player1Y){
			leftPadPos = (rectable?.height * props.spec?.player1Y).toString();
			rightPadpos = (rectable?.height * props.spec?.player2Y).toString();
		}
		return (
			<StyledLeftPad id="Table">
				<StyledHexaArea className='grid'/>
				<StyledHexaAreaLight className='light' x="0px" y="0px" />
				<StyledLeftPad1alias id="leftpad" y={leftPadPos+"px"}></StyledLeftPad1alias>
				<StyledRightPadalias className="rightpad" y={rightPadpos + "px"}></StyledRightPadalias>
				<StyledBallalias id="ball"  x={ballX+"px"} y={ballY+"px"} rot="0px" size={sizeofball.toString()+"px"}></StyledBallalias>
			</StyledLeftPad>)
	}

}
export default MousePadLeft;

	
	
	
	
	

	



	// table = document.getElementById('Table');
	
	// if (table){
	// 	table.addEventListener("mousemove", (e: any) => {
	// 		setY(e.pageY );
	// 	});
	// }





	// const demarre = () => {
	// 	return new Promise((resolve, reject) => {
	// 	var result: test = {table: null,  p1: null, baballe: null};


	// 	result.table = document.getElementById('Table');
	// 	result.baballe = document.getElementById('ball');
	// 	result.p1 = document.getElementById('leftpad');
	// 	console.log(result);
	// 	if(result.table && result.p1 && result.baballe)
	// 		resolve(result);
	// 	else
	// 		reject();

	// 	})
	// }

	// 	demarre().then((result: any) => {
	// 	table = result.table;
	// 	table.addEventListener("mousemove", (e: any) => {
	// 		setY(e.pageY );
	// 	});
	// 	rectable = table.getBoundingClientRect();
	// 	rectpad = result.p1.getBoundingClientRect();
	// 	rectball = result.baballe.getBoundingClientRect();
		
	// 	tmp = y;
	// 	tmp -= rectable.top;
	// 	// pos en %
	// 	pos_prct = tmp / rectable.height * 100;
		
	// 	sizeofball = rectpad.height/3;
		
	// 	if (tmp < rectpad.height){
	// 		tmp = rectpad.height;
	// 	}
	// 	if (tmp > rectable.height - rectpad.height)
	// 		tmp = rectable.height - rectpad.height;
	// }
	// )

	//demarre();

	// if(table && p1 && baballe) {
		
	// 	table.addEventListener("mousemove", (e) => {
	// 		setY(e.pageY );
	// 	});
	// 	rectable = table.getBoundingClientRect();
	// 	rectpad = p1.getBoundingClientRect();
	// 	rectball = baballe.getBoundingClientRect();
		
	// 	tmp = y;
	// 	tmp -= rectable.top;
	// 	// pos en %
	// 	pos_prct = tmp / rectable.height * 100;
		
	// 	sizeofball = rectpad.height/3;
		
	// 	if (tmp < rectpad.height){
	// 		tmp = rectpad.height;
	// 	}
	// 	if (tmp > rectable.height - rectpad.height)
	// 		tmp = rectable.height - rectpad.height;
		
		
		
	// }
	// mouseY = tmp.toString();
	// ballY  = tmp2.toString(); 



	
	// socket.on('onUpdate', (e) => {
	// 	setTmp(e.msg);
	// })
	
	// useInterval(() => {
	// 	socket.emit('updatePlayer', { msg: "lol ca marche pas", from: 'rcuminal' });
	// 	socket.on("connect", () => {
	// 		console.log(socket.connected); // true
	// 	  });
	// 	// socket.off('onUpdate');
	// 	// socket.off('disconnect');
	// 	console.log(tmp3);
	// 	setCount(count + 1);
	// }, 1000);
	
	
//    io  = require('socket.io').listen(app)
	

	
// 	useInterval(() => {
// 		var socket = io.connect('http://localhost:3000');
// 		socket.emit("info",  {
// 			pos: pos_prct,
// 		});
		
// 	}, 50);


	// socket.on("update 2nd player");
	// socket.on("update ball");



//40 64




// const mouseoutLog = document.getElementById('log'),
// red = document.getElementById('red'),
// blue = document.getElementById('blue');

// red.addEventListener('mouseover', overListener);
// red.addEventListener('mouseout', outListener);
// blue.addEventListener('mouseover', overListener);
// blue.addEventListener('mouseout', outListener);

// function outListener(event) {
// let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

// mouseoutLog.innerText = `\nfrom ${event.target.id} into ${related} ${mouseoutLog.innerText}`;
// }

// function overListener(event) {
// let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

// mouseoutLog.innerText = `\ninto ${event.target.id} from ${related} ${mouseoutLog.innerText}`;
// }



// async function useInterval(callback: any, delay: number) {
// 	const savedCallback: any = useRef();
	
// 	// Remember the latest callback.
// 	useEffect(() => {
// 		savedCallback.current = callback;
// 	}, [callback]);
	
// 	// Set up the interval.
// 	useEffect(() => {
// 		function tick() {
// 			if (savedCallback.current)
// 			savedCallback.current();
// 		}
// 		if (delay !== null) {
// 			let id = setInterval(tick, delay);
// 			return () => clearInterval(id);
// 		}
// 	}, [delay]);
		
// }

// type ball = {
// 	x : number,
// 	y : number,
// 	radius: number,
// 	velocityX : number,
// 	velocityY : number,
// 	speed : number,
// 	maph : number,
// 	mapw : number,
// 	ballh : number,
// 	rotate : number,
// };

// function resetBall(ball: ball, width: number, height: number){
//     ball.x = width/2;
//     ball.y = height/2;
//     ball.velocityX = -ball.velocityX;
//     ball.speed = 7;
// }

// async function update(ball: ball, setBall:any){
// 	const newBall = ball;
// 	// if( newBall.x - newBall.radius < 0 ){
//     //     resetBall(newBall, newBall.mapw, newBall.maph);
//     // }else if( newBall.x + newBall.radius > newBall.mapw){
//     //     resetBall(newBall, newBall.mapw, newBall.maph);
//     // }
// 	newBall.x += newBall.velocityX;
// 	newBall.y += newBall.velocityY;
// 	if(newBall.y - newBall.radius + 15 < 0 || newBall.y + newBall.radius > ball.maph - 15){
// 		newBall.velocityY = -newBall.velocityY;
// 		newBall.rotate = +2;
//     }
// 	if(newBall.x - newBall.radius + 15 - 40 < 0 || newBall.x + newBall.radius * 2 >= ball.mapw - 40){
// 		newBall.velocityX = -newBall.velocityX;
// 		newBall.rotate = -2;
//     }
	
// 	setBall(newBall);
// }



// const MousePadLeft = () => {
	
	
// 	const [ball, setBall] = useState({
// 		x : 100,
// 		y : 100,
// 		radius : 10,
// 		velocityX : 1,
// 		velocityY : 1,
// 		speed : 7,
// 		maph : 0,
// 		mapw : 0,
// 		maptop : 0,
// 		ballh : 0,
//         rotate: 90,
// 	});
	
// 	const w = window.innerWidth;
//     const h = window.innerHeight;
//     const sendW = w.toString() + "px";
//     const sendH = h.toString() + "px";
// 	var sendYright: string = "";
// 	let	tmp: number;
// 	var mouseY;
	
// 	const [y, setY] = useState(0);
// 	const [count, setCount] = useState(0);
// 	useInterval(() => {
// 		update(ball, setBall);
// 		setCount(count + 1);
// 	}, 5);
	
// 	useInterval(() => {
// 		document.addEventListener("mousemove", (e) => {
// 			setY(e.pageY - ball.ballh * 1.5);
// 		});
// 	}, 50);
// 	var table = document.querySelector(".Table");
// 	var p1 = document.querySelector(".leftpad");
	
// 	if(table && p1) {
// 		var rect = table.getBoundingClientRect();
// 		var rect1 = p1.getBoundingClientRect();
// 		ball.maptop = rect.top;
// 		ball.mapw = rect.width;
// 		ball.maph = rect.height;
// 		ball.ballh = rect1.height;
		
// 		if (y > rect.height - rect1.height / 2){
// 			tmp = rect.height  - rect1.height / 2;
// 			mouseY = tmp.toString();
// 		}
// 		else if (y <  rect1.height / 2){
// 			tmp =  rect1.height / 2;
// 			mouseY = tmp.toString();
// 		}
// 		else
// 		mouseY = y.toString();		
// 	}
// 	else
// 	console.log("bug");
	
	
// 	var X: number  = ball.x;
//     var Y: number = ball.y;
// 	var Rot: number = ball.rotate;
	
// 	X += 10;
// 	Y += 10;
// 	const sendX = X.toString() + "px";
// 	const sendY = Y.toString() + "px";
// 	const sendRot = "rotate(" + Rot.toString() + "deg)";
// 	if (Y <  ball.maph - ball.ballh / 2  && Y > 0 + ball.ballh / 2){
// 	//	ball.rotate += 2;
// 		Y -= ball.ballh / 2;
// 		sendYright = Y.toString() + "px";
// 	}
// 	else if (Y >=  ball.maph - ball.ballh / 2 ){
// 		Y = ball.maph - ball.ballh;
// 	//	ball.rotate -= 2;
// 		sendYright = Y.toString() + "px";
// 	}
// 	else {
// 		Y = 0;
// 		sendYright = Y.toString() + "px";
// 	}
// 	if (ball.rotate >= 0)
// 		ball.rotate += 2;
// 	else
// 		ball.rotate -= 2;
// 	//var socket = io();
// 	// 	socket.emit("info",  sendY);

// 	// useInterval(() => {
// 	// }, 50);

// 	// socket.on("update 2nd player")
// 	// socket.on("update ball")
// 	return (
// 		<React.Fragment>
// 		<StyledLeftPad className="Table">
// 			<StyledHexaArea className='grid' x="0" y="0" w={sendW} h={sendH}/>
// 			<StyledHexaAreaLight className='light' x={sendX} y={sendY} w={sendW} h={sendH}/>
// 			<StyledLeftPad1alias className="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
// 			<StyledRightPadalias className="rightpad" y={sendYright}></StyledRightPadalias>
// 			<StyledBallalias className="ball"  x={ball.x.toString()+"px"} y={ball.y.toString()+"px"} rot={sendRot}></StyledBallalias>
// 		</StyledLeftPad>
// 	</React.Fragment>	
// 		)
// 	}
// export default MousePadLeft;

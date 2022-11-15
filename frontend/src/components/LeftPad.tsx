import React, { useState, useEffect, useRef } from 'react';
import { StyledLeftPad, StyledLeftPad1alias, StyledLeftPad2, StyledBall, StyledBallalias, StyledRightPadalias } from './game/StyleLeftPad';
import {User} from "./game/User"
import {StyledCursor} from "./Styles/StyleMouse"
import Async from "react-async"
import { useAsync } from "react-async"
import styled from 'styled-components';
import {StyledHexaArea, StyledContainer, StyledGrid, StyledHexaAreaLight} from "./Styles/StyleBackGround"
import BackgroundAnimate from "../components/BackGroundAnimate";
import socketio from 'socket.io';
import { io } from "socket.io-client";


type ball = {
	x : number,
	y : number,
	radius: number,
	velocityX : number,
	velocityY : number,
	speed : number,
	maph : number,
	mapw : number,
	ballh : number,
	rotate : number,
};


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


function resetBall(ball: ball, width: number, height: number){
    ball.x = width/2;
    ball.y = height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

async function update(ball: ball, setBall:any){
	const newBall = ball;
	// if( newBall.x - newBall.radius < 0 ){
    //     resetBall(newBall, newBall.mapw, newBall.maph);
    // }else if( newBall.x + newBall.radius > newBall.mapw){
    //     resetBall(newBall, newBall.mapw, newBall.maph);
    // }
	newBall.x += newBall.velocityX;
	newBall.y += newBall.velocityY;
	if(newBall.y - newBall.radius + 15 < 0 || newBall.y + newBall.radius > ball.maph - 15){
		newBall.velocityY = -newBall.velocityY;
		newBall.rotate = +2;
    }
	if(newBall.x - newBall.radius + 15 - 40 < 0 || newBall.x + newBall.radius * 2 >= ball.mapw - 40){
		newBall.velocityX = -newBall.velocityX;
		newBall.rotate = -2;
    }
	
	setBall(newBall);
}



const MousePadLeft = () => {
	

	const mouseoutLog = document.getElementById('log'),
    red = document.getElementById('red'),
    blue = document.getElementById('blue');

	red.addEventListener('mouseover', overListener);
	red.addEventListener('mouseout', outListener);
	blue.addEventListener('mouseover', overListener);
	blue.addEventListener('mouseout', outListener);

	function outListener(event) {
	let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

	mouseoutLog.innerText = `\nfrom ${event.target.id} into ${related} ${mouseoutLog.innerText}`;
	}

	function overListener(event) {
	let related = event.relatedTarget ? event.relatedTarget.id : "unknown";

	mouseoutLog.innerText = `\ninto ${event.target.id} from ${related} ${mouseoutLog.innerText}`;
	}


	const [ball, setBall] = useState({
		x : window.innerWidth / 2,
		y : window.innerHeight / 2,
		radius : 10,
		velocityX : 1,
		velocityY : 1,
		speed : 7,
		maph : 0,
		mapw : 0,
		maptop : 0,
		ballh : 0,
        rotate: 90,
	});

	
	const w = window.innerWidth;
    const h = window.innerHeight;
    const sendW = w.toString() + "px";
    const sendH = h.toString() + "px";
	var sendYright: string = "";
	let	tmp: number;
	var mouseY;
	
	const [y, setY] = useState(0);
	const [count, setCount] = useState(0);
	//const socket = io();
	
	useInterval(() => {
		update(ball, setBall);
		setCount(count + 1);
	}, 5);
	
	useInterval(() => {
		document.addEventListener("mousemove", (e) => {
			setY(e.offsetY ); //- ball.ballh * 1.5
		});

		setCount(count + 1);
	}, 50);

	// useInterval(() => {
	// 	socket.emit("info",  sendY);
	// }, 1000);

	var table = document.querySelector(".Table");
	var p1 = document.querySelector(".leftpad");
	
	if(table && p1) {
		var rect = table.getBoundingClientRect();
		var rect1 = p1.getBoundingClientRect();
		ball.maptop = rect.top;
		ball.mapw = rect.width;
		ball.maph = rect.height;
		ball.ballh = rect1.height;
		
		if (y > rect.height - rect1.height / 2){
			tmp = rect.height  - rect1.height / 2;
			mouseY = tmp.toString();
		}
		else if (y <  rect1.height / 2){
			tmp =  rect1.height / 2;
			mouseY = tmp.toString();
		}
		else
			mouseY = y.toString();		
	}
	else
		console.log("bug du debut");
	
	
	var X: number  = ball.x;
    var Y: number = ball.y;
	var Rot: number = ball.rotate;
	
	X += 10;
	Y += 10;
	const sendX = X.toString() + "px";
	const sendY = Y.toString() + "px";
	const sendRot = "rotate(" + Rot.toString() + "deg)";
	if (Y <  ball.maph - ball.ballh / 2  && Y > 0 + ball.ballh / 2){
	//	ball.rotate += 2;
		Y -= ball.ballh / 2;
		sendYright = Y.toString() + "px";
	}
	else if (Y >=  ball.maph - ball.ballh / 2 ){
		Y = ball.maph - ball.ballh;
	//	ball.rotate -= 2;
		sendYright = Y.toString() + "px";
	}
	else {
		Y = 0;
		sendYright = Y.toString() + "px";
	}
	if (ball.rotate >= 0)
		ball.rotate += 2;
	else
		ball.rotate -= 2;
	//var socket = io();
	// 	socket.emit("info",  sendY);

	// useInterval(() => {
	// }, 50);

	// socket.on("update 2nd player")
	// socket.on("update ball")
	return (
		<React.Fragment>
		<StyledLeftPad className="Table">
			<StyledHexaArea className='grid' x="0" y="0" w={sendW} h={sendH}/>
			<StyledHexaAreaLight className='light' x={sendX} y={sendY} w={sendW} h={sendH}/>
			<StyledLeftPad1alias className="leftpad" y={mouseY+"px"}></StyledLeftPad1alias>
			<StyledRightPadalias className="rightpad" y={sendYright}></StyledRightPadalias>
			<StyledBallalias className="ball"  x={ball.x.toString()+"px"} y={ball.y.toString()+"px"} rot={sendRot}></StyledBallalias>
		</StyledLeftPad>
	</React.Fragment>	
		)
	}
export default MousePadLeft;

//40 64



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
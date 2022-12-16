import {Dispatch, SetStateAction, FunctionComponent} from 'react';
import { GOT } from '../../shared/types';
import { SocketContext } from '../src/socket/socketPovider';
import { emitSocket } from '../src/socket/socketEmit';
import React, { useContext, useState, useEffect, useRef } from 'react';



interface IProps {
	party: GOT.Party;
	setNotify: Dispatch<any>;
}

interface ball{
	x: number,
	y: number, 
	radius : number,
	velocityX : number,
	velocityY : number,
	speed : number,
	top: number | undefined,
	bottom: number | undefined,
	left : number | undefined,
	right : number | undefined
}
}

interface player {
	x: number,
	y : number,
	width : number,
	height : number,
	score : number,
	top: number | undefined,
	bottom: number | undefined,
	left : number | undefined,
	right : number | undefined
}

const user1: player = 
{
	x: 0,
	y : 500,
	width : 40,
	height : 200,
	score : 0,
	top: undefined,
	bottom: undefined,
	left : undefined,
	right : undefined
}


const user2: player = 
{
	x : 2000 - 40,
	y : 500,
	width : 40,
	height : 200,
	score : 0,
	top: undefined,
	bottom: undefined,
	left : undefined,
	right : undefined
}

const ball: ball = {
	x: 1000,
	y: 500, 
	radius : 31.25,
	velocityX : 5,
	velocityY : 5,
	speed : 7,
	top: undefined,
	bottom: undefined,
	left : undefined,
	right : undefined
}


//UTILS
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





//ALGO
function resetBall(){
	ball.x = 1000;
	ball.y = 500;
	ball.velocityX = -ball.velocityX;
	ball.speed = 7;
}


function collision(b: ball, p: player){
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;
	
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;
	
	return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(props: GOT.Party){
	
	if( ball.x - ball.radius < 0 ){
		props.points2++;
		resetBall();
	}else if( ball.x + ball.radius > 2000){
		props.points2++;
		resetBall();
	}
	
	// the ball has a velocity
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
		
	// when the ball collides with bottom and top walls we inverse the y velocity.
	if(ball.y - ball.radius < 0 || ball.y + ball.radius > 1000){
		ball.velocityY = -ball.velocityY;
	}
	// we check if the paddle hit the user or the com paddle
	let player = (ball.x + ball.radius < 2000 / 2) ? user1 : user2;
	
	// if the ball hits a paddle
	if(collision(ball,player)){
		// we check where the ball hits the paddle
		let collidePoint = (ball.y - (player.y + player.height/2));
		// normalize the value of collidePoint, we need to get numbers between -1 and 1.
		// -player.height/2 < collide Point < player.height/2
		collidePoint = collidePoint / (player.height/2);
		
		// when the ball hits the top of a paddle we want the ball, to take a -45degees angle
		// when the ball hits the center of the paddle we want the ball to take a 0degrees angle
		// when the ball hits the bottom of the paddle we want the ball to take a 45degrees
		// Math.PI/4 = 45degrees
		let angleRad = (Math.PI/4) * collidePoint;
		
		// change the X and Y velocity direction
		let direction = (ball.x + ball.radius < 2000/2) ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
		
		// speed up the ball everytime a paddle hits it.
		ball.speed += 0.1;
	}
}









function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const PartyPlaying: FunctionComponent<IProps> = (props:IProps) => {
	const socket = useContext(SocketContext);




	useInterval(() => {
		update(props.party);
	//	emitSocket.emitSendPlayerPos(socket, ball.x, ball.y, user1.y, user2.y, props.party.user1.username, props.party.user2.username);
	}, 50); //ttes les 0.05s




	while (props.party.points1 != 5 || props.party.points2 != 5){
		(async () => { 
			await delay(3000);
		})();
	}

	return ;
}

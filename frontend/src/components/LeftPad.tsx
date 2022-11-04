import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { createModuleResolutionCache } from 'typescript';
import {Colors} from "./Colors"
import { StyledLeftPad, StyledLeftPad1, StyledLeftPad2, StyledBall } from './game/StyleLeftPad';
import {User} from "./game/User"
import {StyledCursor} from "./Styles/StyleMouse"

const ball = {
	x : 100,
	y : 100,
	radius : 10,
	velocityX : 1,
	velocityY : 1,
	speed : 7,
	maph : 0,
	mapw : 0,
}

function resetBall(width: number, height: number){
    ball.x = width/2;
    ball.y = height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}



function update(){
	
	if( ball.x - ball.radius < 0 ){
        resetBall(ball.mapw, ball.maph);
    }else if( ball.x + ball.radius > ball.mapw){
        resetBall(ball.mapw, ball.maph);
    }
	
	
	ball.x += ball.velocityX;
}



const MousePadLeft = () => {
	
	let	tmp: number;
	let	tmp12: string;
	var mouseY;
	

    const [y, setY] = useState(0);
    document.addEventListener("mousemove", (e) => {
		setY(e.pageY);
		
    });

	var table = document.querySelector(".Table");
	var p1 = document.querySelector(".leftpad");
	
	if(table && p1) {
		
		var rect = table.getBoundingClientRect();
		var rect1 = p1.getBoundingClientRect();
		ball.mapw = rect.width;
		ball.maph = rect.height;
		
		
		if (y > rect.height - 40 - rect1.height / 2){
			tmp = rect.height - 40 - rect1.height / 2;
			mouseY = tmp.toString();
		}
		else if (y < 64 + rect1.height / 2){
			tmp = 64 + rect1.height / 2;
			mouseY = tmp.toString();
		}
		else
		mouseY = y.toString();
		
		
		



	
		
		
		
	}
	else{
		console.log("bug");}

	let framePerSecond = 20;

	setInterval(update,1000/framePerSecond);
	//let loop = setInterval(update,1000/framePerSecond);

	return (
		<StyledLeftPad className="Table">
			<Helmet>
			<script>
				let framePerSecond = 20;

				setInterval(update,1000/framePerSecond);
			</script>
			</Helmet>
				<StyledLeftPad1 className="leftpad" y={mouseY+"px"}></StyledLeftPad1>
				<StyledBall className="ball"  x={ball.x.toString()+"px"} y={ball.y.toString()+"px"}></StyledBall>
				<StyledLeftPad2 className="rightpad"></StyledLeftPad2>
		</StyledLeftPad>
	)
}




export default MousePadLeft;

//40 64
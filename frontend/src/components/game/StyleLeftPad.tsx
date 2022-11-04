import styled from 'styled-components';
import {Colors} from "../Colors"


interface mousePos {
	y: string;
}

interface ballPos {
	x: string;
	y: string;
}

export const StyledLeftPad = styled.div`

position: absolute;
z-index: 10;
top: 50%;
left: 50%;
width: 100%;
height: 100%;
transform: translate(-50%, -50%);
background: green;


`;

export const StyledLeftPad1 = styled.div<mousePos>`
	position: absolute;
	width:3%;
	height:20%;
	background-color: red;
	top: ${p => p.y};
	transform: translate(0, -50%);
	border-radius: 10px;
`;

export const StyledLeftPad2 = styled.div`
	position: absolute;
	width:3%;
	height:20%;
	background-color: red;
	top: 50%;
	left: 97%;
	border-radius: 10px;
`;

export const StyledBall = styled.div<ballPos>`
	position: absolute;
	width:30px;
	height:30px;
	background-color: red;
	top: ${p => p.y};
	left: ${p => p.x};
	border-radius: 100%;
`;
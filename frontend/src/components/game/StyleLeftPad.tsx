import styled from 'styled-components';
import {Colors} from "../Colors"




interface mousePos {
	y: string;
}

interface ballPos {
	x: string;
	y: string;
    rot: string;
	size: string;
}

export const StyledLeftPad = styled.div`

position: absolute;
z-index: 10;
top: 50%;
left: 50%;
width: 100%;
height: 60%;
transform: translate(-50%, -50%);
background-image: url(https://ns328286.ip-37-187-113.eu/ew/wallpapers/800x480/10602_800x480.jpg);
background-size: cover;
overflow: hidden;
opacity: 92%;
border: 3px solid ${Colors.border};
border-radius: 20px;
`;

export const StyledLeftPad1 = styled.div<mousePos>`
position: absolute;
width:2%;
height:20%;
background-color: red;
top: ;
transform: translate(0, -50%);
border-radius: 10px;
background-image: url(https://i.pinimg.com/474x/70/86/62/70866228da01302bce6afc9106e676b0.jpg);
background-position: center;
background-size: 1500%;
z-index: 1;

`;

export const StyledLeftPad2 = styled.div<mousePos>`
position: absolute;
right: 0;
width:2%;
height:20%;
background-color: red;
top: ;
transform: translate(0, -50%);
border-radius: 10px;
background-image: url(https://i.pinimg.com/474x/70/86/62/70866228da01302bce6afc9106e676b0.jpg);
background-position: center;
background-size: 1500%;
z-index: 1;
`;
	
	export const StyledBall = styled.div<ballPos>`
	position: absolute;
	height: 3vh;
	width: 3vh;
	background-image: url(https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-blue-red-glowing-round-ball-free-button-image_1370443.jpg);
	background-position: 55% 45%;
	background-size: 140%;
	top: ;
	left: ;
	border-radius: 100%;
	z-index: 1;
	opacity: 100%;
	filter: brightness(75%);
`;

export const StyledLeftPad1alias = styled(StyledLeftPad1).attrs<mousePos>(p => ({
    style: {
        top: p.y,
    },
  }))<mousePos>`
  `;

  export const StyledRightPadalias = styled(StyledLeftPad2).attrs<mousePos>(p => ({
    style: {
        top: p.y,
    },
  }))<mousePos>`
  `;

  export const StyledBallalias = styled(StyledBall).attrs<ballPos>(p => ({
    style: {
        top: p.y,
        left: p.x,
        transform: p.rot,
		height: p.size,
		width: p.size,
    },
  }))<ballPos>`
  `;

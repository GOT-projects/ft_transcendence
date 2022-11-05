import styled from 'styled-components';



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
background-image: url(https://phoneky.co.uk/thumbs/wallpapers/p2ls/nature/45/a0f747ef12828091.jpg);
background-size: cover;

`;

export const StyledLeftPad1 = styled.div<mousePos>`
	position: absolute;
	width:3%;
	height:20%;
	background-color: red;
	top: ;
	transform: translate(0, -50%);
	border-radius: 10px;
`;

export const StyledLeftPad2 = styled.div`
	position: relative;
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
	background-image: url(https://png.pngtree.com/element_our/20190601/ourlarge/pngtree-blue-red-glowing-round-ball-free-button-image_1370443.jpg);
	background-position: 55% 45%;
	background-size: 140%;
	top: ;
	left: ;
	border-radius: 100%;

`;

export const StyledLeftPad1alias = styled(StyledLeftPad1).attrs<mousePos>(p => ({
    style: {
        top: p.y,
    },
  }))<mousePos>`
  `;

  export const StyledBallalias = styled(StyledBall).attrs<ballPos>(p => ({
    style: {
        top: p.y,
        left: p.x,
    },
  }))<ballPos>`
  `;
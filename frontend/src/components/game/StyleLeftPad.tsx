import styled from 'styled-components';

interface mousePos {
	y: string;
}

interface ballPos {
	x: string;
	y: string;
	rot: string;
	size: string;
}
interface ballPos2 {
	x: string;
	y: string;
	rot: string;
	size: string;
	color: string | undefined,
	urlBg: string | undefined,
}

export const StyledLeftPad = styled.div`
position: absolute;
z-index: 10;
top: 25%;
left: 0%;
width: calc(100% - 10px);
height: 50%;
background-image: url(https://ns328286.ip-37-187-113.eu/ew/wallpapers/800x480/10602_800x480.jpg);
background-size: cover;
overflow: hidden;
opacity: 100%;
box-shadow: inset 0px 0px 20px 20px #0ff,
						0 0 2em #730ae6;
border: 5px solid #400373;
border-radius: 20px;
`;

export const StyledLeftPad1 = styled.div<mousePos>`
position: absolute;
width:2%;
height:20%;
background-color: red;
top: ;
border-radius: 10px;
background-image: url(https://i.pinimg.com/474x/70/86/62/70866228da01302bce6afc9106e676b0.jpg);
background-position: center;
background-size: 1500%;
transform: translate(0, -50%);
z-index: 2;
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
z-index: 2;
`;
	
export const StyledBall = styled.div<ballPos2>`
position: absolute;
background-image: url(${p => p.urlBg});
box-shadow: 0px 0px 4px 4px ${p => p.color};
background-position: 55% 45%;
background-size: 140%;
top: ;
left: ;
border-radius: 50%;
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

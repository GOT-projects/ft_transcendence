import styled from 'styled-components';
import {Colors} from "../Colors"


interface PropsLogo {
  height: string;
  width: string;
  img:string;
}

export const StyledLogin = styled.div`
	display: flex;
	position: absolute;
	align-items: center;
	top: 0;
	left: 0;
	min-height: 100vh;
	width: 100%;
	justify-content: center;
	flex-direction: column;
	background-size: cover;
	background-position: center;
	z-index: 10;
	cursor: none;
	@media screen and (max-width: 768px){
		height: 80%;
	}
`;


export const StyledLoginLogo = styled.div<PropsLogo>`
	width: ${(props)=> props.width};
	height: ${(props) => props.height};
	background-size: cover;
	background-position: center;
	background-image: url(${props => props.img});
	background-size: ${(props) => props.width};
	opacity: 0.8;
	margin: 15px;
	@media screen and (max-width: 768px){
		width: 210px;
		height: 100px;
		background-size: 210px;
	}
`;
export const StyledWaitingContente2FA = styled.div`
	position: absolute;
	display: flex;
	overflow: hidden;
	z-index: 10;
	align-items: center;
	justify-content: center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 450px;
	height: 100px;
	overflow: scroll;
	letter-spacing: 3px;
	outline: transparent;
	background: ${Colors.Bg2fa};
	border-radius: 12px;
`
export const StyledWaitingButton = styled.button`
	margin: 0;
	font-family: "Public Pixel";
	width: 100%;
	height: 80px;
	border-radius: 12px;
	background: ${Colors.greyButton};
`

export const StyledWaiting2FAForm = styled.form`
	--size: 3rem;
	--space: 1rem;
	padding-left: var(--space);
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: calc(var(--size) / 4);
	box-shadow: 0 1em 2em var(--softTint);
	transition: var(--bounce);

	&:focus-within {
		transform: scale(0.94);
		box-shadow: 0 1em 1em var(--softTint);
	}
	input[type="number"] {
		appearance: none;
		-webkit-appearance: none;
		heght: 100%;
		width: var(--size);
		height: calc(var(--size) * 1.4);
		font-size: calc(var(--size) * 0.7);
		text-align: center;
		color: ${Colors.primary};
		background: ${Colors.Bg2faIn};
		border: 0.12em solid ${Colors.border};
		border-radius: calc(var(--size) * 0.2);
		outline: none;
		margin: var(--space);
		margin-left: 0;
		transition: var(--ease);

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			display: none;
		}

		&:not(:placeholder-shown) {
			border-color: var(--primary);
		}
`
export const StyledWaiting2FAInput = styled.input`

`
export const StyledContenteGame = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	z-index: 10;
	align-items: center;
	justify-content: center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	height: 200px;
	overflow: hidden;
	border: 0;
	letter-spacing: 3px;
	outline: transparent;
`

export const StyledWaitingContente = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	z-index: 10;
	align-items: center;
	justify-content: center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	height: 200px;
	overflow: hidden;
	border: 0;
	letter-spacing: 3px;
	outline: transparent;
    @media screen and (max-width: 768px){
	    width: 300px;
	    height: 100px;
	}

	&:after {
		--slice-0: inset(50% 50% 50% 50%);
		--slice-1: inset(80% -6px 0 0);
		--slice-2: inset(50% -6px 30% 0);
		--slice-3: inset(10% -6px 85% 0);
		--slice-4: inset(40% -6px 43% 0);
		--slice-5: inset(80% -6px 5% 0);
		&.Waiting{
			content: 'Waiting...';
		}
		&.Return{
			content: 'Return';
		}
		content: 'Login Intra';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 3%, ${Colors.border} 3%, ${Colors.border} 5%, ${Colors.dark1} 5%);
		text-shadow: -3px -3px 0px ${Colors.dark1}, 3px 3px 0px ${Colors.border};
		clip-path: var(--slice-0);
		animation: glitch 1s infinite ease-in-out;
		animation-timing-function: steps(2, end);
	}

	@keyframes glitch {
	  0% {
		clip-path: var(--slice-1);
		transform: translate(-20px, -10px);
	  }
	  10% {
		clip-path: var(--slice-3);
		transform: translate(10px, 10px);
	  }
	  20% {
		clip-path: var(--slice-1);
		transform: translate(-10px, 10px);
	  }
	  30% {
		clip-path: var(--slice-3);
		transform: translate(0px, 5px);
	  }
	  40% {
		clip-path: var(--slice-2);
		transform: translate(-5px, 0px);
	  }
	  50% {
		clip-path: var(--slice-3);
		transform: translate(5px, 0px);
	  }
	  60% {
		clip-path: var(--slice-4);
		transform: translate(5px, 10px);
	  }
	  70% {
		clip-path: var(--slice-2);
		transform: translate(-10px, 10px);
	  }
	  80% {
		clip-path: var(--slice-5);
		transform: translate(20px, -10px);
	  }
	  90% {
		clip-path: var(--slice-1);
		transform: translate(-10px, 0px);
	  }
	  100% {
		clip-path: var(--slice-1);
		transform: translate(0);
	  }
	}
`

export const StyledWaitingTitle = styled.h1`
	font-family: 'Public Pixel', cursive;
	font-size: 50px;
	color: ${Colors.primary};
	@media screen and (max-width: 768px){
		font-size: 20px;
	}
`

export const StyledLoginButton = styled.a`
	position: absolute;
	width: 380px;
	z-index: 999;
	height: 86px;
	margin-top: 20px;
	font-size: 28px;
	font-family: 'Public Pixel', cursive;
	background: linear-gradient(45deg, transparent 5%, ${Colors.dark1} 5%);
	border: 1px solid;
	border: 0;
	text-decoration: none;
	text-align: center;
	color: #fff;
	letter-spacing: 3px;
	line-height: 88px;
	cursor: pointer;
	box-shadow: 6px 0px 0px ${Colors.border};
	outline: transparent;
	position: relative;
	@media screen and (max-width: 768px){
		width: 210px;
		height: 100px;
		background-size: 210px;
		width: 160px;
		height: 46px;
		overflow: hidden;
		font-size: 14px;
		line-height: 44px;
	}
	&:after {
		--slice-0: inset(50% 50% 50% 50%);
		--slice-1: inset(80% -6px 0 0);
		--slice-2: inset(50% -6px 30% 0);
		--slice-3: inset(10% -6px 85% 0);
		--slice-4: inset(40% -6px 43% 0);
		--slice-5: inset(80% -6px 5% 0);
		content: 'Login Intra';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 3%, ${Colors.border} 3%, ${Colors.border} 5%, ${Colors.dark1} 5%);
		text-shadow: -3px -3px 0px ${Colors.dark1}, 3px 3px 0px ${Colors.border};
		clip-path: var(--slice-0);
	}
	&:hover::after {
		animation: 1s glitch;
		animation-timing-function: steps(2, end);
	}

	@keyframes glitch {
	  0% {
		clip-path: var(--slice-1);
		transform: translate(-20px, -10px);
	  }
	  10% {
		clip-path: var(--slice-3);
		transform: translate(10px, 10px);
	  }
	  20% {
		clip-path: var(--slice-1);
		transform: translate(-10px, 10px);
	  }
	  30% {
		clip-path: var(--slice-3);
		transform: translate(0px, 5px);
	  }
	  40% {
		clip-path: var(--slice-2);
		transform: translate(-5px, 0px);
	  }
	  50% {
		clip-path: var(--slice-3);
		transform: translate(5px, 0px);
	  }
	  60% {
		clip-path: var(--slice-4);
		transform: translate(5px, 10px);
	  }
	  70% {
		clip-path: var(--slice-2);
		transform: translate(-10px, 10px);
	  }
	  80% {
		clip-path: var(--slice-5);
		transform: translate(20px, -10px);
	  }
	  90% {
		clip-path: var(--slice-1);
		transform: translate(-10px, 0px);
	  }
	  100% {
		clip-path: var(--slice-1);
		transform: translate(0);
	  }
	}
`;

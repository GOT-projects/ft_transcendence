
import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'
import IconFriend from "../../assets/LogoFriend.png"

export const StyledHeader = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	top: 0;
	width: 100%;
	height: 4rem;
	cursor: pointer;
	opacity: 0.9;
	z-index: 20;
	background: rgb(4,4,4);
	background: linear-gradient(18deg, rgba(4,4,4,1) 0%, rgba(21,65,93,1) 10%, rgba(28,102,149,1) 20%, rgba(44,153,222,1) 40%, rgba(47,156,226,1) 50%, rgba(44,153,222,1) 60%);
	&.ActiveMenu{
		transition: 0.8s;
	}
	transition: 0.8s;
	@media screen and (max-width: 768px){
		display: block;
		position: fixed;
		background: rgba(47,156,226,1);
	}
`;

export const StyleMenusHeader = styled.ul`
	display: flex;
	position: absolute;
	align-items: center;
	@media screen and (max-width: 768px){
		top: 3rem;
		right: 0;
		width: 220px;
		height: 10rem;
		padding: 5px;
		align-items: flex-start;
		border-left: 2px solid ${Colors.border};
		border-bottom: 2px solid ${Colors.border};
		border-radius: 0 0px 0px 20px;
		flex-direction: column;
		transition: 1s;
		&.ActiveMenu{
			transform: translateY(0);
			transition: 1s;
			background: ${Colors.HeaderColor};
		}
		&.UnActiveMenu{
			display: none;
			transform: translateY(-100%);
			transition: 1s;
		}
	}
`;

export const StyleMenuHeaderAvatarContainte = styled.div`
	display: flex;
	align-items: center;
`

interface Notif{
	colorIcon: string;
}
export const StyleMenuHeaderNotity = styled.div<Notif>`
	display: flex;
	align-items: center;
	margin: 4px;
	color: ${props => props.colorIcon};
	border-radius: 50%;
	transition: 0.4s;
	@media screen and (max-width: 768px){
		display: none;
	}
	&:hover{
		transform: translateY(-4px);
		transition: 0.4s;
	}
`

export const StyleMenuHeaderNotityResp = styled.div<Notif>`
	display: flex;
	align-items: center;
	color: ${props => props.colorIcon};
	border-radius: 50%;
	transition: 0.4s;
	@media screen and (min-width: 768px){
		display: none;
	}
	&:hover{
		transform: translateY(-4px);
		transition: 0.4s;
	}
`
interface Menu{
	colortext: string;
	text: string;
}

export const StyleMenuHeader = styled(Link)<Menu>`
	color: ${props => props.colortext};
	font-family: 'Public Pixel', cursive;
	font-size: 18px;
	text-decoration: none;
	list-style: none;
	padding: 15px;
	transition: 0.8s;

	@media screen and (min-width: 768px){
	&:after {
		--slice-0: inset(50% 50% 50% 50%);
		--slice-1: inset(80% -6px 0 0);
		--slice-2: inset(50% -6px 30% 0);
		--slice-3: inset(10% -6px 85% 0);
		--slice-4: inset(40% -6px 43% 0);
		--slice-5: inset(80% -6px 5% 0);
		content: "Home LeaderBoard Chat";
		font-family: "Public Pixel";
		font-size: 20px;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(18deg, rgba(4,4,4,1) 0%, rgba(21,65,93,1) 10%, rgba(28,102,149,1) 20%, rgba(44,153,222,1) 40%, rgba(47,156,226,1) 50%, rgba(44,153,222,1) 60%, rgba(28,102,149,1) 80%, rgba(21,65,93,1) 90%, rgba(4,4,4,1) 100%);
		// background: linear-gradient(45deg, transparent 3%, ${Colors.border} 3%, ${Colors.border} 5%, ${Colors.dark1} 5%);
		text-shadow: -3px -3px 0px rgba(4,4,4,1), 3px 3px 0px ${Colors.border};
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
	}
`;

export const StyleMenuHeaderLoggout = styled.div`
	color: ${Colors.dark1};
	font-family: 'Public Pixel', cursive;
	font-size: 18px;
	text-decoration: none;
	list-style: none;
	padding: 15px;
	transition: 0.8s;
	&:hover{
		transition: 0.8s;
		color: ${Colors.grey};
		transform: translate( 10px, 0);
		cursor: pointer;
	}
`;

interface ProfilUrl{
	profil?: string | null;
}

export const StyleMenuHeaderProfil = styled.button<ProfilUrl>`
	color: ${Colors.MenuDisable};
	font-size: 20px;
	margin: 10px;
	width: 20px;
	height: 20px;
	border: 2px solid;
	border-radius: 50%;
	background: url(${p => p.profil}) no-repeat;
	background-position: center;
	background-size: 100% 100%;
	text-decoration: none;
	list-style: none;
	padding: 15px;
	transition: 0.8s;
	&:hover{
		transition: 0.8s;
		color: ${Colors.grey};
		transform: translate(3px, 0);
		cursor: pointer;
	}
	@media screen and (max-width: 768px){
		display: none;
	}

`;

export const StyleHeaderUserList = styled.div`
	width: 25px;
	height: 25px;
	margin: 10px;
	background: url(${IconFriend}) no-repeat;
	background-size: 100% 100%;
	transition: 0.4s;
	&:hover{
		transform: translateY(-4px);
		transition: 0.4s;
	}
	@media screen and (max-width: 768px){
		display: none;
	}
`;

export const StyleHeaderUserListResp = styled.div`
	width: 25px;
	height: 25px;
	background: url(${IconFriend}) no-repeat;
	background-size: 100% 100%;
	transition: 0.4s;
	&:hover{
		transform: translateY(-4px);
		transition: 0.4s;
	}
	@media screen and (min-width: 768px){
		display: none;
	}
`;

export const StyleMenuHeaderProfilResp = styled.button<ProfilUrl>`
	color: ${Colors.MenuDisable};
	font-size: 20px;
	margin: 10px;
	width: 20px;
	height: 20px;
	border: 2px solid;
	border-radius: 50%;
	background: url(${p => p.profil}) no-repeat;
	background-position: center;
	background-size: 100% 100%;
	text-decoration: none;
	list-style: none;
	padding: 15px;
	transition: 0.8s;
	&:hover{
		transition: 0.8s;
		color: ${Colors.grey};
		transform: translate(3px, 0);
		cursor: pointer;
	}
	@media screen and (min-width: 768px){
		display: none;
	}

`;
export const StyleNavToggler = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	margin: 8px;
`;
export const StyleNav = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 2rem;
`;

export const StyleNavTogglerIcon = styled.div`
	width: 40px;
	height: 5px;
	margin: 5px;
	display: none;
	cursor: pointer;
	border-radius: 4px;
	background-color: ${Colors.dark1};
	display: none;
	&.ActiveMenu{
	   transition: 0.8s;
	   background: gray;
	}
	transition: 0.8s;
	@media screen and (max-width: 768px){
	   display: block;
	}
`;

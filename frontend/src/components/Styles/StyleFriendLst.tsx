import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";

export const StyledMenuFriend = styled(motion.div)`
	position: absolute;
	top: 3.6rem;
	right: 0;
	width: 300px;
	height: calc(50vh);
	background: #2c99de;
	transition: 0.4x;
	font-family: "Public Pixel";
	border-radius: 0 0 0 20px;
`

export const StyledMenuFriendContente = styled.div`
	display: flex;
	flex-direction: column;
	margin: 10px;
	width: 100%;
	height: 100%;
	overflow: scroll;
`

export const StyleMenuFriendContenteUsername = styled.div`
	width: 140px;
	overflow: hidden;
`;

export const StyleMenuFriendUsername = styled.p`
	padding: 10px;
	&:hover{
		animation: slide-left 6s;
	}
	@keyframes slide-left {
		from {
			margin-left: 0%;
			width: 100%;
		}
		to {
			margin-left: -200%;
			width: 100%;
		}
`;

export const StyleMenuFriendUser = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: 0.6s;
	&:hover{
		transition: 0.6s;
		transform: translateX(-15px);
	}
`


interface Shadow{
	color:string | undefined;
}
export const StyledMenuFriendImgContente = styled.div<Shadow>`
	margin: 15px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	box-shadow: 0px 0px 3px 3px ${p => p.color};
`

interface Img{
	img:string | undefined;
	size:string | undefined;
}
interface Status{
	statusColor:string;
}

export const StyledMenuFriendImg = styled.div<Img>`
	position: relative;
	z-index: 59;
	width: ${p => p.size};
	height:${p => p.size};
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	background: url(${props=> props.img} );
	background-position: center;
	background-size: 100% 100%;
`

export const StyledMenuFriendStatus= styled.div<Status> `
	position: relative;
	z-index: 60;
	width: 15px;
	height:15px;
	transform: translate(205%, -60%);
	border-radius: 50%;
	background: ${props => props.statusColor};
`
export const StyledMenuFriendStatusBehind = styled.div`
	position: relative;
	z-index: 59;
	width: 21px;
	height:21px;
	transform: translate(130%, -128%);
	border-radius: 50%;
	background: ${Colors.HeaderColors};
`

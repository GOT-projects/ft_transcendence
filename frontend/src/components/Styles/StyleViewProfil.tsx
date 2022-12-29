import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";
// import {Link} from 'react-router-dom'
import tennis from "../../assets/tennis.png"
import pong from "../../assets/pinpong.png"
import comet from "../../assets/comet.png"

interface BgColor{
	color:string;
}
export const StyledContaiteViewAddChan = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	width: 300px;
	height: 300px;
	overflow: hidden;
	z-index: 99;
	top: 50%;
	left: 50%;
	opacity: 0.8;
	background-color: ${Colors.grey};
	transform: translate(-50%, -50%);
	border: 2px solid ${Colors.border};
	border-radius: 10px;
	opacity: 0.9;
`
export const StyledMotionDiv = styled(motion.div)`
	@media only screen
	and (min-device-width: 320px)
	and (max-device-width: 480px)
	and (-webkit-min-device-pixel-ratio: 2) {
		  position: relative;
		  z-index: 99;
		  top: -50%;
		  left: 50%;
		  width: 300px;
		  height: 80%;
		  transform: translate(80%, 0);
	  }


`


export const StyledContaiteReturn = styled.div`
	&.addUser{
		position: absolute;
		display: flex;
		gap: 190px;
		top: 270px;
		margin-left: 5px;
	}
`
export const StyledContaiteReturnAddChannel = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	height: 140px;
`

export const StyledContaiteReturnAddButtonP = styled.p`
	color: ${Colors.primary};

`

export const StyledContaiteReturnAddButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	height: 40px;
	margin-right: 10px;
	border: 2px solid ${Colors.Bg2faIn};
	background-color: ${Colors.Bg2faIn};
	border-radius: 10px;
`

export const StyledContaiteReturnDiv = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	width: 100%;
	height: 80px;
	margin-top: -10px;
	margin-left: 10px;
	cursor: pointer;
	color: ${Colors.primary};
	&.joinChan{
		margin-top: 30px;
		margin-left: 10px;
	}
`

export const StyledContaiteDivUser = styled.div`
	position: absolute;
	display: flex;
	top: 50px;
	width: 280px;
	height: 220px;
	border-radius: 10px;
	flex-direction: column;
	overflow: scroll;
	gap: 2px;
	background-color: ${Colors.Bg2fa};
`

export const StyledContaitePUser = styled.p`
	margin: 4px;
	margin-left: 10px;
	font-size: 20px;
	width: 8.2em;
	overflow: hidden;
	color: ${Colors.primary};
`

export const StylePwdProtected = styled.div`
	position: relative;
	border: solid 2px ${Colors.border};
	width: 100%;
	border-radius: 20px;
	background-color: ${Colors.grey};
	z-index: 999;
`

export const StyledContaiteDivPUser = styled.div<BgColor>`
	display: flex;
	align-items: center;
	background-color: ${p => p.color};
	cursor: pointer;
	&.statusAdmin{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	&:hover{
		transition: 0.6s;
		background-color: ${Colors.grey};
	}
`

export const StyledEmptyDiv = styled.div`
	display: none;
`
export const StyledEmptyDivChat = styled.div`
	width: 400px;

`
export const StyledContaiteUser = styled.div`
	height: 20px;
`

export const StyledContaiteAddUser = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 40px;
	margin: 20px;
	font-family: "curve";
	font-size: 20px;
`

export const StyledContaiteViewoptionChan = styled.div`
	height: 160px;
	display: flex;
	flex-direction: column;
	justify-content: center;
`

export const StyledContaiteViewAddP = styled.p`
	margin: 15px;
	font-family: "curve";
	font-size: 20px;
	color: ${Colors.Bg2fa};
	transition: 0.6s;
	&.addTitle{
		color: ${Colors.primary};
	}
	&.exploreTitle{
		color: ${Colors.primary};
	}
	&.addUserTitle{
		color: ${Colors.primary};

	}
	&:hover{
		transition: 0.6s;
		color: ${Colors.primary};
	}

`

export const StyledContaiteViewAddOption = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10px;
	margin-left: 15px;
	width: 90%;
	height: 40px;
	border-radius: 8px;
	border: 1px solid ${Colors.Bg2fa};
	background-color: ${Colors.primary};
	transition: 0.6s;
	opacity: 0.6;
	cursor: pointer;
	&:hover{
		transition: 0.6s;
		background-color: ${Colors.Bg2faIn};
	}
`
export const StyledSelectBall = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`
export const StyledBallTennis = styled.div<BgColor>`
	background-size: 50px;
	width: 100%;
	margin: 10px;
	width: 25px;
	height: 25px;
	box-shadow: 0px 0px 3px 3px ${p => p.color};
	background: url(${tennis});
	background-size: 100% 100%;
	border-radius: 50%;
`
export const StyledBallPong = styled.div<BgColor>`
	background-size: 50px;
	width: 100%;
	margin: 10px;
	width: 25px;
	height: 25px;
	background: url(${pong});
	background-size: 100% 100%;
	box-shadow: 0px 0px 3px 3px ${p => p.color};
	border-radius: 50%;
`

export const StyledBallComet = styled.div<BgColor>`
	background-size: 50px;
	width: 100%;
	margin: 10px;
	width: 30px;
	height: 30px;
	background: url(${comet});
	background-size: 100% 100%;
	box-shadow: 0px 0px 3px 3px ${p => p.color};
	border-radius: 50%;
`

export const StyledContaiteSettingGame = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
	top: 4rem;
	left: 50%;
	width: 300px;
	height: 300px;
	transform: translate(-50%, 50%);
	overflow: hidden;
	opacity: 1;
	border: 2px solid ${Colors.border};
	border-radius: 20px;
	background-color: ${Colors.dark2};
	opacity: 0.9;
	@media screen and (max-width: 768px){
		height: 500px;
	}
`;
export const StyledButtonSetting = styled.div`
	display: flex;
	align-items: center;
	gap: 40px;
	justify-content: space-between;
`

export const StyledButtonP = styled.p`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	border: solid 1px ${Colors.border};
	width: 80px;
	height: 40px;
	background: ${Colors.greyButton};
	&:hover{
		transition: 0.6s;
		background: ${Colors.hoverTextChat}
	}
`

export const StyledContaiteView = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	z-index: 10;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 50%;
	height: calc(100% - 9rem);
	overflow: hidden;
	border: 2px solid ${Colors.border};
	border-radius: 20px;
	background-color: ${Colors.dark2};
	opacity: 0.9;
	@media screen and (max-width: 768px){
        opacity: 1;
	    top: 4rem;
	    left: 0;
	    width: 100%;
	    height: calc(100% - 7.1rem);
	    transform: translate(0, 0);
	}
`;

export const StyledContaiteMenu = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100px;
	height: 100%;
	background: ${Colors.Bg2faIn};
	transition: 0.6s;
	overflow: hidden;
	@media screen and (max-width: 768px){
	    width: 80px;
		&.UnActiveMenu{
			z-index: 20;
			transform: translate(-100px);
			transition: 0.3s;
		}
	}
`
export const StyledContaiteMenuSelector = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	transform: translateX(-2px);
	transition: 0.6s;
	&.select{
		transition: 0.6s;
		transform: translateX(10px);
	}
	@media screen and (max-width: 768px){
	    transform: translateX(-16px);
        padding-left: 12px;
	    &.select{
	    	transition: 0.6s;
	    	transform: translateX(2px);
            padding-left:0 ;
	    }
    }
`

export const StyledSelector = styled.div`
	margin-left: 0;
	height: 100%;
	width: 10px;
	border-radius: 0 10px 0 10px;
	background-color: ${Colors.border};
	transition: 0.6s;
	@media screen and (max-width: 768px){
	}
`
export const StyledContaiteChannel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100px;
	height: 100%;
	overflow: scroll;
	transition: 0.6s;
	background-color: ${Colors.Bg2faIn};
`
export const StyledChanSep = styled.div`
	margin-left: 10px;
	width: 80%;
	height: 4px;
	border-radius: 2px;
	background-color: ${Colors.Bg2fa};
`
export const StyledChanPadd = styled.p`
	font-size: 20px;
`

export const StyledMenuTitle = styled.div`
	font-size: 20px;
	color: ${Colors.primary};
`
export const StyledChanDiv = styled.div`
	display: flex;
	margin: 10px;
	margin-top: 5px;
	margin-right: 10px;
	margin-left: 20px;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	background-color: ${Colors.bgChannel};
	transition: 0.6s;
	&.add{
		background-color: ${Colors.green};
	}
	&:hover{
		transition: 0.6s;
		border-radius: 20%;
	}
	&.select{
		transition: 0.6s;
		border-radius: 20%;
	}
	@media screen and (max-width: 768px){
	    &.select{
            margin-left: 12px;
        }
    }
`

export const StyledContaiteAddChanDiv = styled.div`
	display: flex;
	margin-left: 10px;
	margin-right: 10px;
	align-items: center;
	justify-content: space-between;
`
interface Icolor{
	color:string;
}
export const StyledContaiteAddChanOption = styled.div<Icolor>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80px;
	height: 30px;
	border: 2px solid ${Colors.Bg2fa};
	border-radius: 10px;
	background-color: ${p => p.color};
`
export const StyledContaiteAddChanOptionP = styled.div<Icolor>`
	color: ${p => p.color};
`

export const StyledContaiteClose = styled.div`
	display: flex;
	margin: 0px;
	margin-top: 10px;
	margin-right: 10px;
	flex-direction: row-reverse;
	gap: 54px;
	align-items: center;
	cursor: pointer;
	&.addUser{
		position: absolute;
	}
	&.statusAdmin{
		gap: 126px;
	}
	&.explore{
		gap: 90px;
		position: absolute;
	}
	&.removeUser{
		gap: 50px;
		position: absolute;
	}
	&.joinChan{
		gap: 94px;
	}
	&.unBlock{
		gap: 115px;
	}
	&.invite{
		gap: 94px;
	}
	&.pwd{
		gap: 37px;
	}
`
export const StyledInputPwdProtected = styled.input`
	margin: 16px;
	margin-bottom: 25px;
	color: ${Colors.grey};
`

export const StyledContaiteRank = styled.div`
	display: flex;
	margin: 10px;
	flex-direction: row-reverse;
	align-items: center;
`
export const StyledContaiteHistorytile = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	border: 2px solid ${Colors.border};
	border-radius: 20px;
`
export const StyledContaiteHistory = styled.div`
	display: flex;
	margin: 10px;
	height: 100%;
	flex-direction: column;
	overflow-y: scroll;
	background-color: ${Colors.ChatMenu};
	align-items: center;
	border: 2px solid ${Colors.border};
	border-radius: 24px;
`
export const StyledContaiteHistorylst = styled.div`
	display: flex;
	justify-content: space-evenly;
	margin: 10px;
	width: 100%;
	align-items: center;
`
export const StyledContaiteHistoryUser = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10px;
	width: 12em;
	overflow: hidden;
`
export const StyledContaiteHistoryUserButton = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	right: 10px;
	justify-content: flex-end;
	gap: 10px;

`

export const StyledContaiteHistoryScore = styled.div`
	display: flex;
	margin: 10px;
	width: 8em;
	overflow: hidden;
`
export const StyledContaiteHistoryVs = styled.div`
	display: flex;
	margin: 10px;
	width: 18px;
`

interface Isize{
	size:string;
}
export const StyledContaiteText = styled.p<Isize>`
	font-family: "Public Pixel";
	color: ${Colors.dark1};
	font-size: ${p => p.size};
	&.title{
		width: 10em;
		overflow: hidden;
	}

`

export const StyledContaiteProfil = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

interface Ibg{
	profilImg:string | null |undefined;
}
export const StyledViewAvatar = styled.div<Ibg>`
	margin: 10px;
	width: 50px;
	height: 50px;
	background: url(${p => p.profilImg});
	background-size: 100% 100%;
	border-radius: 50%;
`;

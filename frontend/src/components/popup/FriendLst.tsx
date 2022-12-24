import {Dispatch, FunctionComponent, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';
import { emitSocket } from '../../socket/socketEmit';
import { SocketContext } from '../../socket/socketPovider';
import { Colors } from '../Colors';
import { StyledMenuFriend, StyledMenuFriendContente, StyleMenuFriendUser, StyledMenuFriendImg, StyledMenuFriendImgContente, StyledMenuFriendStatus, StyledMenuFriendStatusBehind, StyleMenuFriendContenteUsername, StyleMenuFriendUsername } from '../Styles/StyleFriendLst';

interface IProps {
	profil: GOT.Profile | undefined;
	setFriendsLst: Dispatch<React.SetStateAction<boolean>>;
}

interface IProp {
	img: string | undefined,
	status: string | undefined,
	username: string | undefined,
	page: string | undefined,
	size: string | undefined,
}

export const StatusProfile:FunctionComponent<IProp> = (props:IProp)=> {
	const handleBg = () => {
		if (props.page === "friendsList" && props.status !== ""){
			return true
		}
		return false
	}
	const handleStatus = () => {
		if (props.status === "online" || props.status === "inGame"){
			return "green"
		}else{
			return "red"
		}
	}
	return(
		<StyledMenuFriendImgContente color={props.status === "inGame" ? Colors.border : "none"}>
			<StyledMenuFriendImg img={props.img} size={props.size}/>
			{props.status === "" ? <></> : <StyledMenuFriendStatus statusColor={handleStatus()}/>}
			{handleBg() ? <StyledMenuFriendStatusBehind/> : <></>}
		</StyledMenuFriendImgContente>
	)
}


const PopupListFriends:FunctionComponent<IProps> = (props:IProps) => {
	const socket = useContext(SocketContext);
	const navigate = useNavigate()

	useEffect(() => {
		emitSocket.emitFriends(socket);
	}, [socket])

	const handleGotoMsg = (user:string) =>{
		props.setFriendsLst(false);
		navigate(`/chat?code=Private&name=${user}`);
	}
	return (
		<StyledMenuFriend
			initial={{x: 300}}
			animate={{x:0}}
			transition={{duration: 1}}
			exit={{x: 300, opacity: 0}}>
			<StyledMenuFriendContente>
			{props.profil?.friends?.map((friend) => (
					<StyleMenuFriendUser key={uuid()} onClick={ () => handleGotoMsg(friend.login)}>
						<StatusProfile size={"40px"} img={friend.urlImg} username={friend.login} status={friend.status} page="friendsList"/>
						<StyleMenuFriendContenteUsername>
							<StyleMenuFriendUsername>{friend.login}</StyleMenuFriendUsername>
						</StyleMenuFriendContenteUsername>
					</StyleMenuFriendUser>
			))}
			</StyledMenuFriendContente>
		</StyledMenuFriend>
	)
}

export default PopupListFriends;

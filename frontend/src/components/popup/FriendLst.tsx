import {Dispatch, FunctionComponent, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';
import { emitSocket } from '../../socket/socketEmit';
import { SocketContext } from '../../socket/socketPovider';
import { StyledMenuFriend, StyledMenuFriendContente, StyleMenuFriendUser, StyledMenuFriendImg, StyledMenuFriendImgContente, StyledMenuFriendStatus, StyledMenuFriendStatusBehind, StyleMenuFriendContenteUsername, StyleMenuFriendUsername } from '../Styles/StyleFriendLst';

interface IProps {
    profil: GOT.Profile | undefined;
   setFriendsLst: Dispatch<React.SetStateAction<boolean>>;
}

interface IProp {
    img: string,
    status: string,
    username: string,
}

const StatusProfile:FunctionComponent<IProp> = (props:IProp)=> {
    return(
        <StyledMenuFriendImgContente>
            <StyledMenuFriendImg img={props.img}/>
            <StyledMenuFriendStatus statusColor={props.status === "online" ? "green" : "red"}/>
            <StyledMenuFriendStatusBehind/>
        </StyledMenuFriendImgContente>
    )
}

const PopupListFriends:FunctionComponent<IProps> = (props:IProps) => {
    const socket = useContext(SocketContext);
    const [friends, setFriends] = useState<GOT.Friend[]>()
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
                        <StatusProfile img={friend.urlImg} username={friend.login} status={friend.status}></StatusProfile>
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

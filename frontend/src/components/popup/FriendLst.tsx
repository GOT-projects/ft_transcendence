import {Dispatch, FunctionComponent, useContext, useEffect, useState} from 'react';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';
import { SocketContext } from '../../socket/socketPovider';
import { StyledMenuFriend, StyledMenuFriendContente, StyleMenuFriendUser, StyledMenuFriendImg, StyledMenuFriendImgContente, StyledMenuFriendStatus, StyledMenuFriendStatusBehind } from '../Styles/StyleFriendLst';

interface IProps {
    setFriendList: Dispatch<any>;
    profil: GOT.Profile | undefined;
}

interface IProp {
    img: string,
    status: string,
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

    //get erreur for notify
    useEffect(() => {
        socket.on('client_friends', (rep:GOT.Friend[]) => {
            console.log('client_friend', rep);
            setFriends(rep);
        })
        return () => {
            socket.off('client_friends');
        } 
    },[socket])

    useEffect(() => {
        socket.emit('server_friends', "");
    }, [socket])

    const handleGotoMsg = (user:string) =>{
        window.location.href = '/chat?code=' + user;
    }
    return (
        <StyledMenuFriend
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: 300, opacity: 0}}>
            <StyledMenuFriendContente>
            {friends?.map((friend) => (
                    <StyleMenuFriendUser key={uuid()} onClick={ () => handleGotoMsg(friend.username)}>
                        <StatusProfile img={friend.urlImg} status={"online"}></StatusProfile>
                    </StyleMenuFriendUser>
            ))}
            </StyledMenuFriendContente>
        </StyledMenuFriend>
    )
}

export default PopupListFriends;

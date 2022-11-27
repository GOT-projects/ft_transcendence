
import {Dispatch, FunctionComponent, useState} from 'react';
import { v4 as uuid } from 'uuid';
import { accountService } from '../../services/account.service';
import { GOT } from '../../types';
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
    let imgUrl: string;
    const [friends, setFriends] = useState([
        {id: uuid(), name: "test", img: accountService.getUrlImg(), status:"online", inGame: false},
        {id: uuid(), name: "Robert", img: accountService.getUrlImg(), status:"offline", inGame: true},
        {id: uuid(), name: "Jean", img: accountService.getUrlImg(), status:"offline", inGame: false},
        {id: uuid(), name: "aartiges", img: accountService.getUrlImg(), status:"offline", inGame: false},
        {id: uuid(), name: "rcuminal", img: accountService.getUrlImg(), status:"offline", inGame: false},
    ])

    const handleGotoMsg = (user:string) =>{
        window.location.href = '/chat?code=' + user;
    }
    if (props.profil?.userInfos.urlImg){
        imgUrl = props.profil.userInfos.urlImg;
    }
    return (
        <StyledMenuFriend
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: 300, opacity: 0}}>
            <StyledMenuFriendContente>
            {friends?.map((friend) => (
                    <StyleMenuFriendUser key={friend.id} onClick={ () => handleGotoMsg(friend.name)}>
                        <StatusProfile img={imgUrl} status={friend.status}></StatusProfile>
                        <p>{friend.name}</p>
                    </StyleMenuFriendUser>
            ))}
            </StyledMenuFriendContente>
        </StyledMenuFriend>
    )
}

export default PopupListFriends;

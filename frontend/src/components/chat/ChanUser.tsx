import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../shared/types";
import { SocketContext } from "../../socket/socketPovider";
import {StyledChatDivhandle, StyledChatDivoption, StyledChatPrivAvatar, 
StyledChatPrivName, StyledChatSettingButton, StyledUser } from "../Styles/StyleChat";
import { v4 as uuid } from 'uuid';
import { SiUblockorigin } from "react-icons/si";
import { emitSocket } from "../../socket/socketEmit";
import { Colors } from "../Colors";
import { CgProfile } from "react-icons/cg";
import { AiOutlineUserAdd } from "react-icons/ai";
import { onSocket } from "../../socket/socketOn";
import { offSocket } from "../../socket/socketOff";
import { StyledEmptyDivChat } from "../Styles/StyleViewProfil";


interface IProps {
   profil: GOT.Profile | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>> | undefined;
   popuProfil: boolean | undefined;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
   setLogin:Dispatch<React.SetStateAction<string>> | undefined;
   chanName: string;
}
enum UserChannelStatus {
    MEMBER = 'MEMBER',
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    BAN = 'BAN'
}

const ChanUserMenu:FunctionComponent<IProps> = (props: IProps) => {
    const socket = useContext(SocketContext)
    const [userList, setUserlist] = useState<GOT.ChannelUsers>();
    const [myStatus, setMyStatus] = useState<UserChannelStatus>();

    useEffect(() => {
        emitSocket.emitChannelsIn(socket);
    }, [socket])
    const handleViewProfil = (name: string) =>{
        if (props.setLogin && props.setPopupProfil){
            props.setLogin(name);
            props.setPopupProfil(true);
        }
    }
    
    const handleAddFriend = (login:string) => {
        emitSocket.emitDemandFriend(socket, login);
    }

    useEffect(() => {
        onSocket.client_chanmsg_users_not_ban(socket, setUserlist);
        const tmp = userList?.users.filter((ls) => props.profil?.userInfos.login === ls.login); 
        if (tmp && tmp.length !== 0){
            setMyStatus(tmp[0].status);
        }else{
            setMyStatus(undefined);
        }
        return () => {
            offSocket.client_chanmsg_users_not_ban(socket);
        }
    }, [socket, setUserlist, userList])

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])
    
    useEffect(() => {
        emitSocket.emitChanUserNotBan(socket, props.chanName);
    }, [socket])

    const handleBlock = (login:string) => {
        emitSocket.emitChanBlock(socket, props.chanName, login)
    }

    return (
        <> 
            {userList ? 
            userList?.users.map((user:GOT.UserChannel) => (
                user.status !== UserChannelStatus.BAN  && user.login !== props.profil?.userInfos.login?
                <StyledUser key={uuid()} color={Colors.ChatMenuButton} >
                    <StyledChatDivhandle >
                        <StyledChatPrivAvatar profil={user.urlImg}/>
                        <StyledChatPrivName key={uuid()}>{user.login}</StyledChatPrivName>
                    </StyledChatDivhandle>
                <StyledChatDivoption>
                    <StyledChatSettingButton onClick={() => {handleViewProfil(user.login)}} title="View Profile">
                        <CgProfile className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                    {myStatus === UserChannelStatus.OWNER || (myStatus === UserChannelStatus.ADMIN && user.status !== UserChannelStatus.OWNER) ? 
                    <StyledChatSettingButton onClick={() => {handleBlock(user.login)}} title="Ban user">
                        <SiUblockorigin size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton> : <></>}
                    <StyledChatSettingButton onClick={() => {handleAddFriend(user.login)}} title="add friend">
                        <AiOutlineUserAdd className='setting' size={30} color={Colors.ChatMenuButtonText} />
                    </StyledChatSettingButton>
                </StyledChatDivoption>
                </StyledUser> : <StyledEmptyDivChat key={uuid()}/>)) : <StyledEmptyDivChat key={uuid()}/>}
        </>
    )
}

export default ChanUserMenu;

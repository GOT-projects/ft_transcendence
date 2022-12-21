import { Dispatch, FunctionComponent, useContext, useEffect } from "react";
import { GOT } from "../../shared/types";
import { SocketContext } from "../../socket/socketPovider";
import { StyledChatDivEmpty, StyledChatDivhandle, StyledChatDivoption, StyledChatPrivAvatar, StyledChatPrivName, StyledChatSettingButton, StyledUser } from "../Styles/StyleChat";
import { v4 as uuid } from 'uuid';
import { emitSocket } from "../../socket/socketEmit";
import { Colors } from "../Colors";
import { CgProfile } from "react-icons/cg";
import { MdOutlineBlock } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { StyledEmptyDivChat } from "../Styles/StyleViewProfil";
import { StatusProfile } from "../popup/FriendLst";


interface IProps {
   selectUser: GOT.User | undefined;
   profil: GOT.Profile | undefined;
   setSelectUser:Dispatch<React.SetStateAction<GOT.User | undefined>> | undefined;
   userFriend: GOT.Friend[] | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>> | undefined;
   popuProfil: boolean | undefined;
   friends:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
   setLogin:Dispatch<React.SetStateAction<string>> | undefined;
}

const PriveUserMenu:FunctionComponent<IProps> = (props: IProps) => {
    const socket = useContext(SocketContext)
    const navigate = useNavigate();

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])

    const handleSelectFriend = (name:string) => {
        const user = props.friends?.filter((user) => user.login === name);
        if (user){
            const tmp:GOT.User = user[0];
            if (props.setSelectUser)
                props.setSelectUser(tmp);
        }
        emitSocket.emitPrivmsg(socket, name);
        if (props.setActive)
            props.setActive("UnActiveMenu");
        navigate(`/chat?code=Private&name=${name}`);
    }
    
    const handleViewProfil = (name: string) =>{
        if (props.setLogin && props.setPopupProfil){
            props.setLogin(name);
            props.setPopupProfil(true);
        }
    }

    const handleBlockUser = (name: string) => {
        const filter = props.profil?.blocks.filter((block) => block.login === name);
        if (filter?.length !== 0){
            emitSocket.emitUnBlockUser(socket, name);
        }else{
            emitSocket.emitBlockUser(socket, name);
        }
    }
    const handleBlockUserColor = (name: string) => {
        const filter = props.profil?.blocks.filter((block) => block.login === name);
        if (filter?.length !== 0){
            return false
        }else{
            return true
        }
    }

    const handleAddFriend = (login:string) => {
        emitSocket.emitDemandFriend(socket, login);
    }

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])
    
    const handleFriend = (login: string) => {
        const tmp = props.profil?.friends?.filter((user) => user.login === login);
        if (tmp !== undefined && tmp.length !== 0)
            return (true);
        return (false);
    }

    const handleStatus = (login: string)=>{
        const tmp = props.profil?.friends.filter((f) => f.login === login)
        if (tmp?.length !== 0 && tmp !== undefined){
            return tmp[0].status;
        }
        return ""
    }

    return (
        <>
            {props.friends ? 
            props.friends?.map((user:GOT.User) =>(
                <StyledUser key={uuid()} color={user.login === props.selectUser?.login ? 
                        Colors.ChatMenuButton : Colors.ChatMenu} >
                    <StyledChatDivhandle onClick={() => {handleSelectFriend(user.login)}}>
                        <StatusProfile size={"40px"} img={user.urlImg} username={user.login} status={handleStatus(user.login)} page={"priv"}/>
                        <StyledChatPrivName key={uuid()}>{user.login}</StyledChatPrivName>
                    </StyledChatDivhandle>
                <StyledChatDivoption>
                    <StyledChatSettingButton onClick={() => {handleViewProfil(user.login)}}>
                        <CgProfile className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                    <StyledChatSettingButton onClick={() => {handleBlockUser(user.login)}}>
                        <MdOutlineBlock className='setting' size={30} color={handleBlockUserColor(user.login) ? 
                                Colors.ChatMenuButtonText : "red"}/>
                    </StyledChatSettingButton>
                    {handleFriend(user.login) ? <StyledChatDivEmpty/> :
                    <StyledChatSettingButton onClick={() => {handleAddFriend(user.login)}}>
                        <AiOutlineUserAdd className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                }
                </StyledChatDivoption>
                </StyledUser>)): <StyledEmptyDivChat key={uuid()}/>}
        </>
    )
}

export default PriveUserMenu;

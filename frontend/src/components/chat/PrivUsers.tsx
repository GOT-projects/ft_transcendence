import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../shared/types";
import { SocketContext } from "../../socket/socketPovider";
import { StyledAddInput, StyledAddInputdiv, StyledAddInputdivButton, StyledChatDivEmpty, StyledChatDivhandle, StyledChatDivoption, StyledChatPrivAvatar, StyledChatPrivName, StyledChatSettingButton, StyledUser } from "../Styles/StyleChat";
import { v4 as uuid } from 'uuid';
import { GrAddCircle } from "react-icons/gr";
import { emitSocket } from "../../socket/socketEmit";
import { Colors } from "../Colors";
import { CgProfile } from "react-icons/cg";
import { MdOutlineBlock } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";


interface IProps {
   friends: GOT.User[] | undefined;
   selectUser: GOT.User | undefined;
   setSelectUser:Dispatch<React.SetStateAction<GOT.User | undefined>> | undefined;
   usersList: GOT.User[] | undefined;
   popupUser: GOT.User | undefined;
   setPopupUser:Dispatch<React.SetStateAction<GOT.User | undefined>> | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>> | undefined;
   popuProfil: boolean | undefined;
}

const PriveUserMenu:FunctionComponent<IProps> = (props: IProps) => {
    const socket = useContext(SocketContext)
    const navigate =useNavigate();
    const [friends, setFriends] = useState<GOT.Friend[]>()

    useEffect(() => {
        socket.on('client_friends', (rep:GOT.Friend[]) => {
            setFriends(rep);
        })
        return () => {
            socket.off('client_friends');
        } 
    },[socket])
    const handleSelectFriend = (name:string) => {
        const user = props.friends?.filter((user) => user.login === name);
        if (user){
            const tmp:GOT.User = user[0];
            if (props.setSelectUser)
                props.setSelectUser(tmp);
        }
        emitSocket.emitPrivmsg(socket, name);
        navigate(`/chat?code=Priv&name=${name}`);
    }
    
    const handleViewProfil = (name: string) =>{
        const user = props.usersList?.filter((user) => user.login === name);
        if (user && props.popupUser){
            const tmp:GOT.User = user[0];
            if (props.setPopupUser)
                props.setPopupUser(tmp);
            if (!props.popuProfil && props.setPopupProfil)
                props.setPopupProfil(true);
        }
    }

    const handleBlockUser = (name: string) => {
        emitSocket.emitBlockUser(socket, name);
    }

    const handleAddFriend = (login:string) => {
        emitSocket.emitDemandFriend(socket, login);
    }

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])
    return (
        <>
            {props.friends?.map((user:GOT.User) =>(
                <StyledUser key={uuid()} color={user.username === props.selectUser?.username ? Colors.ChatMenuButton : Colors.ChatMenu} >
                    <StyledChatDivhandle onClick={() => {handleSelectFriend(user.username)}}>
                        <StyledChatPrivAvatar profil={user.urlImg}/>
                        <StyledChatPrivName key={uuid()}>{user.username}</StyledChatPrivName>
                    </StyledChatDivhandle>
                <StyledChatDivoption>
                    <StyledChatSettingButton onClick={() => {handleViewProfil(user.login)}}>
                        <CgProfile className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                    <StyledChatSettingButton onClick={() => {handleBlockUser(user.login)}}>
                        <MdOutlineBlock className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                    {friends?.find((friend) => (friend.login === user.login)) ? <StyledChatDivEmpty/>:
                    <StyledChatSettingButton onClick={() => {handleAddFriend(user.login)}}>
                        <AiOutlineUserAdd className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                    }
                </StyledChatDivoption>
                </StyledUser>))}
        </>
    )
}

export default PriveUserMenu;

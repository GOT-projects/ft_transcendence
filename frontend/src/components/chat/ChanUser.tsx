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
import ProfilView from "../popup/ProfilView";


interface IProps {
   profil: GOT.Profile | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>> | undefined;
   popuProfil: boolean | undefined;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
   setLogin:Dispatch<React.SetStateAction<string>> | undefined;
}

const ChanUserMenu:FunctionComponent<IProps> = (props: IProps) => {
    const socket = useContext(SocketContext)
    const navigate = useNavigate();
    const [userList, setUserlist] = useState(["test", "test1", "data"])

    const handleViewProfil = (name: string) =>{
        if (props.setLogin && props.setPopupProfil){
            props.setLogin(name);
            props.setPopupProfil(true);
        }
    }

    const handleBlockUser = (name: string) => {
        const filter = props.profil?.blocks.filter((block) => block.login === name);
        if (filter?.length !== 0){
            console.log("Unblock")
            emitSocket.emitUnBlockUser(socket, name);
        }else{
            console.log("block")
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

    return (
        <>
            {userList.map((user:string) =>(
                <StyledUser key={uuid()} color={Colors.ChatMenuButton} >
                    <StyledChatDivhandle >
                        <StyledChatPrivAvatar profil={user}/>
                        <StyledChatPrivName key={uuid()}>{user}</StyledChatPrivName>
                    </StyledChatDivhandle>
                <StyledChatDivoption>
                    <StyledChatSettingButton onClick={() => {handleViewProfil(user)}}>
                        <CgProfile className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                    </StyledChatSettingButton>
                </StyledChatDivoption>
                </StyledUser>))}
        </>
    )
}

export default ChanUserMenu;

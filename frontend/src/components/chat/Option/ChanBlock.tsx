import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, 
        StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, 
        StyledContaiteViewAddChan, StyledContaiteViewAddP, StyledEmptyDiv } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { onSocket } from "../../../socket/socketOn";
import { v4 as uuid } from "uuid";
import { offSocket } from "../../../socket/socketOff";

interface IProps {
   listUser:GOT.User[] | undefined;
   setAdd:Dispatch<React.SetStateAction<string>> | undefined;
   friends:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   profil: GOT.Profile | undefined;
   setInvite:Dispatch<React.SetStateAction<boolean>>;
   chanName: string;
}

enum UserChannelStatus {
    MEMBER = 'MEMBER',
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    BAN = 'BAN'
}

const PopupOptionBlock:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const [input, setInput] = useState("");
    const [selectUser, setSelectUser] = useState<GOT.User[]>([]);
    const [userList, setUserlist] = useState<GOT.ChannelUsers>();

    const handleClose = () => {
        props.setInvite(false);
        navigate(`/chat?code=Channel&name=${props.chanName}&Setting=false`)
    }

    useEffect(() => {
        onSocket.client_chanmsg_users_not_ban(socket, setUserlist);
        return () => {
            offSocket.client_chanmsg_users_not_ban(socket);
        }
    }, [socket, setUserlist, userList])

    useEffect(() => {
        emitSocket.emitChanUserNotBan(socket, props.chanName);
    }, [socket])

    const handleSelect = (user: GOT.User) => {
        const find = selectUser.find((select) => select.login === user.login)
        if (find){
            const tmp = selectUser.filter((filter) => filter.login !== user.login);
            if (tmp)
                setSelectUser(tmp);
        }else{
            setSelectUser((prev) => [...prev, user]);
        }
	}	

    const handleSend = () => {
        selectUser.map((user) => {
            emitSocket.emitChanUnBlock(socket, props.chanName, user.login);
        })
        props.setInvite(false);
        handleClose();
    }

    const handleListUser = (login : string) => {
        const tmp = userList?.users.filter((user) => user.login === login)
        if (tmp && tmp.length !== 0){
            if (tmp[0].status === UserChannelStatus.BAN){
                return true
            }
        }
        return false
    }
    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose onClick={handleClose} className="unBlock">
                    <FaWindowClose size={30} color={Colors.dark1}/>
                    <StyledContaiteViewAddP className="removeUser">
                            Unblock users
                    </StyledContaiteViewAddP>
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <StyledContaiteDivUser key={uuid()}>
                    {userList?.users.map((user) => (
                            handleListUser(user.login) ? 
                            <StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user)}} 
                                color={selectUser.find((select) => select.login === user.login) ? 
                                Colors.grey : Colors.Bg2faIn}>
                                <StyledContaitePUser key={uuid()} >{user.login}</StyledContaitePUser>
                            </StyledContaiteDivPUser> : <StyledEmptyDiv key={uuid()}></StyledEmptyDiv>
                    ))}
                </StyledContaiteDivUser>
            </StyledContaiteAddUser>
            <StyledContaiteReturn className="addUser">
                <StyledContaiteReturnDiv onClick={handleSend}>
                    <p>unBlock users</p>
                </StyledContaiteReturnDiv>
            </StyledContaiteReturn>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionBlock;

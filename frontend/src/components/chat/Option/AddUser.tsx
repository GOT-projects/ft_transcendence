import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteUser, StyledContaiteViewAddChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { onSocket } from "../../../socket/socketOn";
import { v4 as uuid } from "uuid";

interface IProps {
   setAction:Dispatch<React.SetStateAction<boolean>> | undefined;
   listUser:GOT.User[] | undefined;
   setAdd:Dispatch<React.SetStateAction<string>> | undefined;
   friends:GOT.User[] | undefined;
   userList:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   profil: GOT.Profile | undefined;
}
const PopupOptionAddUser:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const [input, setInput] = useState("");
    const [selectUser, setSelectUser] = useState<GOT.User[]>([]);

    const handleClose = () => {
        if (props.setAction){
            props.setAction(false);
            navigate("/chat");
        }
    }

    const handleSelect = (user: GOT.User) => {
        const find = selectUser.find((select) => select.login === user.login)
        if (find !== undefined){
            console.log("pop");
            setSelectUser((select) => select.filter((use) => use.login !== user.login))
        }else if (setSelectUser){
            const tmp:GOT.User[] = [];
            tmp.push(user);
            if (setSelectUser)
                setSelectUser(tmp);
        }
	}	

    const handleReturn = () => {
        if (props.setAdd)
            props.setAdd("");
    }

    const handleSend = async () => {
        console.log("send selection ",selectUser);
        selectUser.map( async (select ) => {
            await emitSocket.emitSendPrivmsg(socket, select.login, "👋");
            if (props.setFriends){
                if (props.friends)
                    props.setFriends([...props.friends, select]);
                }else{
                    const tmp:GOT.User[] = [];
                    tmp.push(select);
                    setSelectUser(tmp)
                }
            navigate(`/chat?code=Priv`);
        })
        navigate(`/chat?`);
    }

    const handleListUser = (login : string) => {
        if (login === props.profil?.userInfos.login)
            return (false);
        const tmp =props.profil?.friends.filter((user) => user.login === login);
        if (tmp !== undefined && tmp.length !== 0)
            return (false);
        const tmp1 =props.friends?.filter((user) => user.login === login);
        if (tmp1 !== undefined && tmp1.length !== 0)
            return (false);
        return (true);
    }

    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <h3>Add user</h3>
                <StyledContaiteDivUser>
                    {props.listUser?.map((user) => (
                            handleListUser(user.login) ? 
                            <StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user)}} 
                                color={selectUser.find((select) => select.login === user.login) ? Colors.grey : Colors.Bg2faIn}>
                                <StyledContaitePUser>{user.login}</StyledContaitePUser>
                            </StyledContaiteDivPUser> : <></>
                    ))}
                </StyledContaiteDivUser>
            </StyledContaiteAddUser>
            <StyledContaiteReturn className="addUser">
                <StyledContaiteReturnDiv onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
                <StyledContaiteReturnDiv onClick={handleSend}>
                    <p>send</p>
                </StyledContaiteReturnDiv>
            </StyledContaiteReturn>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionAddUser;

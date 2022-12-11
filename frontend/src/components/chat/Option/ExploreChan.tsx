import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteUser, StyledContaiteViewAddChan, StyledContaiteViewAddP } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { onSocket } from "../../../socket/socketOn";
import { v4 as uuid } from "uuid";

interface IProps {
}
const PopupOptionExloreChat:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const [selectUser, setSelectUser] = useState<string[]>([]);
    const [chan, setChan] = useState(["chan", "42", "general", "Update"]);

    const handleClose = () => {
            navigate("/chat");
    }

    const handleSelect = (user: string) => {
        const find = selectUser.find((select) => select === user)
        if (find !== undefined){
            setSelectUser((select) => select.filter((use) => use !== user))
        }else if (setSelectUser){
            const tmp:string[] = [];
            tmp.push(user);
            if (setSelectUser)
                setSelectUser(tmp);
        }
	}	

    const handleReturn = () => {
        navigate("/chat?code=joinChannel")
    }

    const handleSend = async () => {
        console.log("send selection ", selectUser);
    }

    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose className="explore" onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
                    <StyledContaiteViewAddP className="ExploreTitle">Explore channel</StyledContaiteViewAddP>
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <StyledContaiteDivUser>
                    {chan.map((user) => (
                            <StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user)}} 
                                color={selectUser.find((select) => select === user) ? Colors.grey : Colors.Bg2faIn}>
                                <StyledContaitePUser key={uuid()}>{user}</StyledContaitePUser>
                            </StyledContaiteDivPUser>
                    ))}
                </StyledContaiteDivUser>
            </StyledContaiteAddUser>
            <StyledContaiteReturn className="addUser">
                <StyledContaiteReturnDiv onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
                <StyledContaiteReturnDiv onClick={handleSend}>
                    <p>add</p>
                </StyledContaiteReturnDiv>
            </StyledContaiteReturn>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionExloreChat;

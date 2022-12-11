import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP, StyledContaiteViewoptionChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";

interface IProps {
}

const PopupOptionPrivateChan:FunctionComponent<IProps> = (props: IProps) =>{
    const [add, setAdd] = useState("");
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("/chat?code=Prvi")
         
    }

    const handleReturn = () => {
        navigate("/chat?code=joinChannel")
    }

    const handleAdd = (name: string) => {
       setAdd(name); 
       navigate(`/chat?code=${name}`)
    }
    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose className="joinChan" onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
                    <StyledContaiteViewAddP className="addUserTitle">Channel options</StyledContaiteViewAddP>
            </StyledContaiteClose>
            <StyledContaiteViewoptionChan>
                <StyledContaiteViewAddOption onClick={() => {handleAdd("explore")}}>
                    <StyledContaiteViewAddP>Channel name:</StyledContaiteViewAddP>
                    <input/>
                </StyledContaiteViewAddOption>
                <StyledContaiteViewAddOption onClick={() => {handleAdd("privateChan")}}>
                    <StyledContaiteViewAddP>Password:</StyledContaiteViewAddP>
                    <input/>
                </StyledContaiteViewAddOption>
            </StyledContaiteViewoptionChan> 
                <StyledContaiteReturnDiv className="joinChan" onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionPrivateChan;

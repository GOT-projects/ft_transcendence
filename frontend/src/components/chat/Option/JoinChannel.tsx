import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";

interface IProps {
   setAction:Dispatch<React.SetStateAction<boolean>> | undefined;
   listUser:GOT.User[] | undefined;
   setAdd:Dispatch<React.SetStateAction<string>> | undefined;
}
const PopupOptionJoinChannel:FunctionComponent<IProps> = (props: IProps) =>{
    const [add, setAdd] = useState("");

    const handleClose = () => {
        if (props.setAction)
            props.setAction(false);
    }

    const handleReturn = () => {
        if (props.setAdd)
            props.setAdd("");
    }

    const handleAdd = (name: string) => {
       setAdd(name); 
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
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <h3>Join channel</h3>
            </StyledContaiteAddUser>
            <StyledContaiteViewAddOption onClick={() => {handleAdd("public")}}>
                <StyledContaiteViewAddP>Explore channel</StyledContaiteViewAddP>
                <StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
            </StyledContaiteViewAddOption>
            <StyledContaiteViewAddOption onClick={() => {handleAdd("private")}}>
                <StyledContaiteViewAddP>Join channel private</StyledContaiteViewAddP>
                <StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
            </StyledContaiteViewAddOption>
                <StyledContaiteReturnDiv className="joinChan" onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionJoinChannel;

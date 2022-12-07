
import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddChanDiv, StyledContaiteAddChanOption, StyledContaiteAddChanOptionP, StyledContaiteAddUser, StyledContaiteClose, StyledContaiteReturn, StyledContaiteReturnAddChannel, StyledContaiteReturnDiv, StyledContaiteViewAddChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";

interface IProps {
   setAction:Dispatch<React.SetStateAction<boolean>> | undefined;
   listUser:GOT.User[] | undefined;
   friends:GOT.User[] | undefined;
   setFriend:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   setAdd:Dispatch<React.SetStateAction<string>> | undefined;
}
const PopupOptionAddChannel:FunctionComponent<IProps> = (props: IProps) =>{
    const socket = useContext(SocketContext)
    const [input, setInput] = useState("");
    const [selecte, setSelecte] = useState("");
    const handleClose = () => {
        if (props.setAction)
            props.setAction(false);
    }
    const handleChange = (event: any,) => {
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}	
    const handleReturn = () => {
        console.log("return")
        if (props.setAdd)
            props.setAdd("");
    }

    const handleSelect = (name: string) =>{
        setSelecte(name);
    }
    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <form>
                <StyledContaiteAddChanDiv>
                    <p>Creation Channel</p>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <input type="text" placeholder="Channel name"/>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <p>Options Channel:</p>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <StyledContaiteAddChanOption color={selecte === "private" ? Colors.Bg2faIn : ""} onClick={() => {handleSelect("private")}}>
                        <StyledContaiteAddChanOptionP color={selecte === "private" ? Colors.primary : ""}>Private</StyledContaiteAddChanOptionP>
                    </StyledContaiteAddChanOption>
                    <StyledContaiteAddChanOption color={selecte === "protected" ? Colors.Bg2faIn : ""} onClick={() => {handleSelect("protected")}}>
                        <StyledContaiteAddChanOptionP color={selecte === "protected" ? Colors.primary : ""}>Protected</StyledContaiteAddChanOptionP>
                    </StyledContaiteAddChanOption>
                    <StyledContaiteAddChanOption color={selecte === "public" ? Colors.Bg2faIn : ""} onClick={() => {handleSelect("public")}}>
                        <StyledContaiteAddChanOptionP color={selecte === "public" ? Colors.primary : ""}>Public</StyledContaiteAddChanOptionP>
                    </StyledContaiteAddChanOption>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <p>Password</p>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <input type="password" placeholder="Channel password" name="password" autoComplete="on"/>
                </StyledContaiteAddChanDiv>
                <StyledContaiteReturnAddChannel>
                    <StyledContaiteReturnDiv onClick={handleReturn}>
                        <p>return</p>
                    </StyledContaiteReturnDiv>
            </StyledContaiteReturnAddChannel>

            </form>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionAddChannel;

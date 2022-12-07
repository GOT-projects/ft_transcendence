import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteViewAddChan } from "../../Styles/StyleViewProfil";
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
const PopupOptionAddUser:FunctionComponent<IProps> = (props: IProps) =>{
    const socket = useContext(SocketContext)
    const [input, setInput] = useState("");
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
    const send = (event : any) => {
        if (event.key === "Enter"){
            if (props.listUser){
                const user = props.listUser?.filter((user:GOT.User) => user.login === input);
                if (user && user.length > 0){
                    console.log("add user")
                    let tmp = props.friends;
                    if (tmp !== undefined && props.setFriend){
                        tmp.push(user[0]);
                        props.setFriend(tmp);
                    }
                }
            }
            if (props.setAction)
                props.setAction(false); 
        }
	}	
    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 250}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <h1>Add user</h1>
                <input type="text" value={input} onChange={handleChange} onKeyDown={send} autoFocus/>
            </StyledContaiteAddUser>
            <StyledContaiteReturn>
                <StyledContaiteReturnDiv onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
            </StyledContaiteReturn>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionAddUser;

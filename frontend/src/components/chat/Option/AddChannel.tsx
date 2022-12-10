import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddChanDiv, StyledContaiteAddChanOption, StyledContaiteAddChanOptionP, StyledContaiteAddUser, StyledContaiteClose, StyledContaiteReturn, StyledContaiteReturnAddButton, StyledContaiteReturnAddButtonP, StyledContaiteReturnAddChannel, StyledContaiteReturnDiv, StyledContaiteViewAddChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { NotifyInter } from "../../interfaces";
import { Notification } from "../../Notify";
import { useNavigate } from "react-router-dom";

interface IProps {
   setAction:Dispatch<React.SetStateAction<boolean>> | undefined;
   listUser:GOT.User[] | undefined;
   setAdd:Dispatch<React.SetStateAction<string>> | undefined;
}

enum ChannelStatus {
    PUBLIC = 'PUBLIC',
    PROTECTED = 'PROTECTED',
    PRIVATE = 'PRIVATE'
}

const PopupOptionAddChannel:FunctionComponent<IProps> = (props: IProps) =>{
    const socket = useContext(SocketContext)
    const [inputChan, setInputChan] = useState("");
    const [inputPwd, setInputPwd] = useState("");
    const [selecte, setSelecte] = useState("");
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});

    const handleChangeChan = (event: any,) => {
        if (inputChan === "" && event.target.value ==="\n")
            return;
		setInputChan(event.target.value);
	}	

    const handleChangePwd = (event: any,) => {
        if (inputPwd === "" && event.target.value ==="\n")
            return;
        if (selecte === "public"  || selecte === "")
            return;
		setInputPwd(event.target.value);
	}	

    const handleReturn = () => {
        console.log("return")
        if (props.setAdd)
            props.setAdd("");
    }

    const handleSelect = (name: string) =>{
        setSelecte(name);
    }

    const handleSend = () =>{
        let chan:GOT.Channel | undefined = undefined;
        if (selecte === "public"){
            if (inputChan === ""){
                setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
            }else{
                chan = {name:inputChan, status: ChannelStatus.PUBLIC, password:undefined}; 
            }
        }else if (selecte === "protected"){
            if (inputChan === ""){
                setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
            }else if (inputPwd === ""){
                setNotify({isOpen: true, message: "Please choose password to your channel", type: "error"})
            }else{
                chan = {name:inputChan, status: ChannelStatus.PROTECTED, password:inputPwd}; 
            }
        }else if (selecte === "private"){
            if (inputChan === ""){
                setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
            }else if (inputPwd === ""){
                setNotify({isOpen: true, message: "Please choose password to your channel", type: "error"})
            }else{
                chan = {name:inputChan, status: ChannelStatus.PRIVATE, password:inputPwd}; 
            }
        }else{
            setNotify({isOpen: true, message: "Please select type of Channel", type: "error"})
        }
        if (chan !== undefined){
            emitSocket.emitCreateChan(socket, chan);
        }
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
                    <input type="text" placeholder="Channel name" value={inputChan} onChange={handleChangeChan} autoFocus/>
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
                    <p>Password:</p>
                </StyledContaiteAddChanDiv>
                <StyledContaiteAddChanDiv>
                    <input type="password" placeholder="Channel password" name="password" value={inputPwd} onChange={handleChangePwd} autoComplete="on"/>
                </StyledContaiteAddChanDiv>
                <StyledContaiteReturnAddChannel>
                    <StyledContaiteReturnDiv >
                        <StyledContaiteReturnAddButton onClick={handleSend}>
                            <StyledContaiteReturnAddButtonP>send</StyledContaiteReturnAddButtonP>
                        </StyledContaiteReturnAddButton>
                        <StyledContaiteReturnAddButton onClick={handleReturn}>
                            <StyledContaiteReturnAddButtonP>return</StyledContaiteReturnAddButtonP>
                        </StyledContaiteReturnAddButton>
                    </StyledContaiteReturnDiv>
            </StyledContaiteReturnAddChannel>

            </form>
            <Notification notify={notify} setNotify={setNotify}/>
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionAddChannel;

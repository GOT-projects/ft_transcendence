import {StyledMenuProfileUsername, StyledMenuProfileUsernameButton, StyledMenuProfileUsernameOption, StyledMenuProfileUsernameTitle, StyledMenuProfileUsernameInput, StyledMenuProfileUsernameContente} from "../Styles/StyleMenuProfilHeader"
import {Dispatch, SetStateAction, FunctionComponent, useState, useEffect, useContext} from 'react';
import {NotifyInter} from "../../components/interfaces"
import { SocketContext } from "../../socket/socketPovider";

interface IProps {
   setChangeUsername: Dispatch<SetStateAction<boolean>>;
   notify: NotifyInter;
   setNotify: Dispatch<any>;
}
const PopupChangeUsername:FunctionComponent<IProps> = (props:IProps) => {
    const socket = useContext(SocketContext);
    const [input, setInput] = useState("");
    const [inputdata, setInputdata] = useState("");

    useEffect(() => {
        socket.off('client_change_username').on('client_change_username', (rep: any) => {
            console.log(rep);
            setInput("");
        })
    }, [socket])
    
    const handleOk = () => {
        if (input === "")
            return;
        socket.emit("server_change_username", input);
        props.setChangeUsername(false);
        props.setNotify({isOpen: true, message: 'Change Username to ' + input , type:'success'});
        setInputdata(input);
    }
    const handleCancel = () => {
        props.setNotify({isOpen: true, message: 'Username is already use', type:'error'});
        props.setChangeUsername(false);
    }
    function handleOnChange(e:any){
        if (input === "" && e.target.value ==="\n")
            return;
        setInput(e.target.value);
    }
    return ( 
        <StyledMenuProfileUsername 
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: 300, opacity: 0}}>
            <StyledMenuProfileUsernameContente>
                <StyledMenuProfileUsernameTitle>New name</StyledMenuProfileUsernameTitle>
                <StyledMenuProfileUsernameInput type="text" value={input} onChange={(e)=>{handleOnChange(e)}} 
                                                              onKeyDown={(e)=>{
                                                                if (e.key === "Enter")
                                                                    handleOk()}} autoFocus/>
                <StyledMenuProfileUsernameOption>
                    <StyledMenuProfileUsernameButton onClick={handleOk}>ok</StyledMenuProfileUsernameButton>
                    <StyledMenuProfileUsernameButton onClick={handleCancel}>cancel</StyledMenuProfileUsernameButton>
                </StyledMenuProfileUsernameOption>
            </StyledMenuProfileUsernameContente>
        </StyledMenuProfileUsername>
    )
}

export default PopupChangeUsername;

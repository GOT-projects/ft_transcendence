import {StyledMenuProfileUsername, StyledMenuProfileUsernameButton, StyledMenuProfileUsernameOption, StyledMenuProfileUsernameTitle, StyledMenuProfileUsernameInput, StyledMenuProfileUsernameContente} from "../Styles/StyleMenuProfilHeader"
import {Dispatch, SetStateAction, FunctionComponent, useState} from 'react';
import {NotifyInter} from "../../components/interfaces"

interface IProps {
   setChangeUsername: Dispatch<SetStateAction<boolean>>;
   notify: NotifyInter;
   setNotify: Dispatch<any>;
}
const PopupChangeUsername:FunctionComponent<IProps> = (props:IProps) => {
    const [input, setInput] = useState("");
    const handleOk = () => {
        props.setChangeUsername(false);
        props.setNotify({isOpen: true, message: 'Change Username is Done', type:'success'});
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
                <StyledMenuProfileUsernameInput value={input} onChange={(e)=>{handleOnChange(e)}} 
                                                              onKeyDown={(e)=>{
                                                                if (e.key === "Enter")
                                                                    handleOk()}}/>
                <StyledMenuProfileUsernameOption>
                    <StyledMenuProfileUsernameButton onClick={handleOk}>ok</StyledMenuProfileUsernameButton>
                    <StyledMenuProfileUsernameButton onClick={handleCancel}>cancel</StyledMenuProfileUsernameButton>
                </StyledMenuProfileUsernameOption>
            </StyledMenuProfileUsernameContente>
        </StyledMenuProfileUsername>
    )
}

export default PopupChangeUsername;

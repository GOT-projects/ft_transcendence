import { Dispatch, FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { GOT } from "../../shared/types";
import { StyleNavToggler, StyleNavTogglerIcon } from "../Styles/StyledHeader";
import { StyledChanDiv, StyledChanPadd, StyledChanSep, StyledContaiteChannel, StyledContaiteMenu, StyledMenuTitle } from "../Styles/StyleViewProfil";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   chatSwitch: string; 
   setChatSwitch:Dispatch<React.SetStateAction<string>> | undefined;
   listUser:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   setAdd:Dispatch<React.SetStateAction<string>>;
   add:string;
   friends:GOT.User[] | undefined;
   channelIn:GOT.Channel[] | undefined;
   active: string;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
}


const MenuChat:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();

    const handlePriveMsg = (name:string) => {
        if (props.setChatSwitch){
            props.setChatSwitch(name);
            navigate("/chat?code=Private")
        }
    }

    const handleChan = (name:string) => {
        if (props.setChatSwitch){
            props.setChatSwitch(name);
            navigate(`/chat?code=Channel&name=${name}`)
        }
    }
    const navMenu = () => {
        if (props.active === "ActiveMenu" && props.setActive) {
            props.setActive("UnActiveMenu");
        } else if (props.setActive){
            props.setActive("ActiveMenu");
        }
        navigate("/chat")
    }

    const handleAddChannel = () => {
        props.setAdd("add");
        if (props.setActive)
            props.setActive("UnActiveMenu");
        navigate("/chat?code=add")
    }

    return (
        <StyledContaiteMenu> 
            <StyleNavToggler onClick={navMenu} className={props.active}>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
            </StyleNavToggler>
        <StyledContaiteMenu className={props.active}>
            <StyledChanDiv onClick={() => {handlePriveMsg("private")}}>
                <StyledMenuTitle>Prive</StyledMenuTitle>
            </StyledChanDiv>
            <StyledChanSep/>
            <StyledContaiteChannel>
                <StyledChanDiv className="add"onClick={() => {handleAddChannel()}}>
                    <StyledChanPadd >+</StyledChanPadd>
                </StyledChanDiv>
                {props.channelIn?.map((chan) => (
                    <StyledChanDiv key={uuid()} onClick={() => {handleChan(chan.name)}}>
                        <p>{chan.name.substring(0, 4)}</p>
                    </StyledChanDiv>
                ))}
            </StyledContaiteChannel>
        </StyledContaiteMenu> 
        </StyledContaiteMenu>
    )
}
export default MenuChat;

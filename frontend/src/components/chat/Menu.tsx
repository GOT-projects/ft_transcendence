import { Dispatch, FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { accountService } from "../../services/account.service";
import { GOT } from "../../shared/types";
import { StyledChatWindow } from "../Styles/StyleChat";
import { StyleNavToggler, StyleNavTogglerIcon } from "../Styles/StyledHeader";
import { StyledChanDiv, StyledChanPadd, StyledChanSep, StyledContaiteChannel, StyledContaiteMenu } from "../Styles/StyleViewProfil";
import PopupAddChannel from "./AddChannel";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   chatSwitch: string; 
   setChatSwitch:Dispatch<React.SetStateAction<string>> | undefined;
   listUser:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   setAdd:Dispatch<React.SetStateAction<boolean>>;
   add:boolean;
   friends:GOT.User[] | undefined;
   active: string;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
}


const MenuChat:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();

    const handlePriveMsg = (name:string) => {
        if (props.setChatSwitch){
            props.setChatSwitch(name);
            navigate("/chat?code=Priv")
        }
    }

    const navMenu = () => {
        if (props.active === "ActiveMenu" && props.setActive) {
            props.setActive("UnActiveMenu");
        } else if (props.setActive){
            props.setActive("ActiveMenu");
        }
    }

    const handleAddChannel = () => {
        props.setAdd(true);
        navigate("/chat?code=add")
    }

    const channel = ["channel 1", "channel 12", "channel 12312", "channel 1", 
    "channel 12", "channel 12312", "channel 1", "channel 12", "channel 12312"];
    return (
        <StyledContaiteMenu> 
            <StyleNavToggler onClick={navMenu} className={props.active}>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
            </StyleNavToggler>
        <StyledContaiteMenu className={props.active}>
            <StyledChanDiv onClick={() => {handlePriveMsg("private")}}>
                <p>Prive</p>
            </StyledChanDiv>
            <StyledChanSep/>
            <StyledContaiteChannel>
                <StyledChanDiv className="add"onClick={() => {handleAddChannel()}}>
                    <StyledChanPadd >+</StyledChanPadd>
                </StyledChanDiv>
                {channel.map((chan) => (
                    <StyledChanDiv key={uuid()} onClick={() => {handlePriveMsg(chan)}}>
                        <p>{chan.substring(0, 4)}</p>
                    </StyledChanDiv>
                ))}
            </StyledContaiteChannel>
            {props.add ? <PopupAddChannel friends={props.friends} setFriends={props.setFriends} profil={props.profil} setProfil={props.setProfil} setAction={props.setAdd} listUser={props.listUser}/> : <></>}
        </StyledContaiteMenu> 
        </StyledContaiteMenu>
    )
}
export default MenuChat;

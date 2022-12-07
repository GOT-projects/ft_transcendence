import { Dispatch, FunctionComponent, useState } from "react";
import { v4 as uuid } from "uuid";
import { GOT } from "../../shared/types";
import { StyledChatWindow } from "../Styles/StyleChat";
import { StyledChanDiv, StyledChanPadd, StyledChanSep, StyledContaiteChannel, StyledContaiteMenu } from "../Styles/StyleViewProfil";
import PopupAddChannel from "./AddChannel";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   chatSwitch: string; 
   setChatSwitch:Dispatch<React.SetStateAction<string>> | undefined;
   listUser:GOT.User[] | undefined;
}


const MenuChat:FunctionComponent<IProps> = (props: IProps) =>{
    const [add, setAdd] =  useState(false);
    const handlePriveMsg = (name:string) => {
        if (props.setChatSwitch)
            props.setChatSwitch(name);
    }
    const handleAddChannel = () => {
        setAdd(true);
    }
    const channel = ["channel 1", "channel 12", "channel 12312", "channel 1", 
    "channel 12", "channel 12312", "channel 1", "channel 12", "channel 12312"];
    return (
        <StyledContaiteMenu> 
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
            {add ? <PopupAddChannel profil={props.profil} setProfil={props.setProfil} setAction={setAdd} listUser={props.listUser}/> : <></>}
        </StyledContaiteMenu>
    )
}

export default MenuChat;

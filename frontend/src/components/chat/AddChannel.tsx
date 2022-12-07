import { Dispatch, FunctionComponent, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../shared/types";
import { Colors } from "../Colors";
import { StyledChanDiv, StyledChanSep, StyledContaiteChannel, StyledContaiteClose, StyledContaiteMenu, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP } from "../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import PopupOptionAddUser from "./Option/AddUser";
import PopupOptionAddChannel from "./Option/AddChannel";
import PopupOptionJoinChannel from "./Option/JoinChannel";


interface IProps {
   profil: GOT.Profile | undefined;
   friends:GOT.User[] | undefined;
   listUser:GOT.User[] | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   setAction:Dispatch<React.SetStateAction<boolean>> | undefined;
   setFriend:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
}


const PopupAddChannel:FunctionComponent<IProps> = (props: IProps) =>{
    const [add, setAdd] = useState("");
    const handleClose = () => {
        if (props.setAction)
            props.setAction(false);
    }

    const handleAdd = (name: string) => {
       setAdd(name); 
    }

    return (
        <StyledContaiteViewAddChan>
            {add === "" ?
            <motion.div
            initial={{x: 300, y: 0}}
            animate={{x:0, y:0}}
            transition={{duration: 1}}
            exit={{x: 100, y: 0}}>
            <StyledContaiteClose onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
            </StyledContaiteClose>
            <StyledContaiteViewAddP>Add</StyledContaiteViewAddP>
            <StyledContaiteViewAddOption onClick={() => {handleAdd("addUser")}}>
                <StyledContaiteViewAddP >Add user for prive msg</StyledContaiteViewAddP>
                <StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
            </StyledContaiteViewAddOption>
            <StyledContaiteViewAddOption onClick={() => {handleAdd("addChannel")}}>
                <StyledContaiteViewAddP>Create channel</StyledContaiteViewAddP>
                <StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
            </StyledContaiteViewAddOption>
            <StyledContaiteViewAddOption onClick={() => {handleAdd("joinChannel")}}>
                <StyledContaiteViewAddP>Join channel</StyledContaiteViewAddP>
                <StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
            </StyledContaiteViewAddOption>
            </motion.div> : <></>}
            {add === "addUser" ? <PopupOptionAddUser setAction={props.setAction} 
                                listUser={props.listUser} friends={props.friends} 
                                setFriend={props.setFriend} setAdd={setAdd}/> : <></>}
            {add === "addChannel" ? <PopupOptionAddChannel setAction={props.setAction} 
                                listUser={props.listUser} friends={props.friends} 
                                setFriend={props.setFriend} setAdd={setAdd}/> : <></>}
            {add === "joinChannel" ? <PopupOptionJoinChannel setAction={props.setAction} 
                                listUser={props.listUser} friends={props.friends} 
                                setFriend={props.setFriend} setAdd={setAdd}/> : <></>}
        </StyledContaiteViewAddChan>
    )
}

export default PopupAddChannel;

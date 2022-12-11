import { Dispatch, FunctionComponent, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../shared/types";
import { Colors } from "../Colors";
import { StyledChanDiv, StyledChanSep, StyledContaiteChannel, StyledContaiteClose, StyledContaiteMenu, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP } from "../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import PopupOptionAddUser from "./Option/AddUser";
import PopupOptionAddChannel from "./Option/AddChannel";
import PopupOptionJoinChannel from "./Option/JoinChannel";
import { useNavigate } from "react-router-dom";


interface IProps {
   profil: GOT.Profile | undefined;
   listUser:GOT.User[] | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   setAction:Dispatch<React.SetStateAction<string>>;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   friends:GOT.User[] | undefined;
}


const PopupAddChannel:FunctionComponent<IProps> = (props: IProps) =>{
    const [add, setAdd] = useState("");
    const navigate = useNavigate();
    const handleClose = () => {
        if (props.setAction){
            props.setAction("");
            navigate("/chat");
        }
    }

    const handleAdd = (name: string) => {
       setAdd(name); 
       navigate(`/chat?code=${name}`)
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
            <StyledContaiteViewAddP className="addTitle">Add</StyledContaiteViewAddP>
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
        </StyledContaiteViewAddChan>
    )
}

export default PopupAddChannel;

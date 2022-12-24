import { FunctionComponent, useContext, useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddP, StyledInputPwdProtected, StylePwdProtected } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { onSocket } from "../../../socket/socketOn";
import { v4 as uuid } from "uuid";
import { offSocket } from "../../../socket/socketOff";
import { MdOutlinePrivateConnectivity } from 'react-icons/md';

export enum ChannelStatus {
    PUBLIC = 'PUBLIC',
    PROTECTED = 'PROTECTED',
    PRIVATE = 'PRIVATE'
}

interface IProps {
    channelIn: GOT.Channel[] | undefined ;
}

const PopupOptionExloreChat:FunctionComponent<IProps> = (props: IProps) =>{
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const [selectUser, setSelectUser] = useState<string>();
    const [inputPwd, setInputPwd] = useState<string>();
    const [popupPwd, setPopopsPwd] = useState<boolean>(false);
    const [channel, setChannel] = useState<GOT.Channel[]>();

    useEffect(() => {
        emitSocket.emitChannels(socket);
    }, [socket])

    useEffect(() => {
        onSocket.client_channels(socket, setChannel);
        return () => {
            offSocket.client_channel(socket);
        } 
    }, [socket, setChannel])

    const handleClose = () => {
            navigate("/chat");
    }

    const handleClosePwd = () => {
        setPopopsPwd(false);
    }

    const handleSelect = (user: string) => {
            setSelectUser(user)
        console.log("select", selectUser )
	}	

    const handleReturn = () => {
        setPopopsPwd(false);
        navigate("/chat?code=add")
    }

    const handleSend = async () => {
        //TODO need check if channel are protected or not
        if (selectUser !== undefined && selectUser !== ""){
            const tmp = channel?.filter((lst) => lst.name === selectUser);
            if (tmp && tmp[0].status === ChannelStatus.PROTECTED){
                setPopopsPwd(true);
            }else{
                emitSocket.emitChannelJoin(socket, selectUser, undefined);
                navigate(`/chat?code=chan&name=${selectUser[0]}`);
            }
        }
    }

    const handleStatus = (status:GOT.Channel) => {
        if (status.status === ChannelStatus.PRIVATE){
            return false;
        } 
        return true
    }
    const  handChange = (event: any) =>{
        if (inputPwd === "" && event.target.value ==="\n")
            return;
		setInputPwd(event.target.value);
	}

    const Send = async () => {
        //TODO need check if channel are protected or not
        if (selectUser !== "" && selectUser !== undefined){
            const tmp = channel?.filter((lst) => lst.name === selectUser);
            if (tmp && tmp[0].status === ChannelStatus.PROTECTED){
                emitSocket.emitChannelJoin(socket, selectUser, inputPwd);
            }
            setPopopsPwd(false);
            navigate(`/chat?code=chan&name=${selectUser[0]}`);
        }
    }

    return (
        <StyledContaiteViewAddChan>
            <motion.div
            initial={{x: 200}}
            animate={{x:0}}
            transition={{duration: 1}}
            >
            <StyledContaiteClose className="explore" onClick={handleClose}>
                    <FaWindowClose size={30} color={Colors.dark1}/>
                    <StyledContaiteViewAddP className="ExploreTitle">Explore channel</StyledContaiteViewAddP>
            </StyledContaiteClose>
            <StyledContaiteAddUser>
                <StyledContaiteDivUser>
                    {channel?.map((user) => (
                            handleStatus(user) ? 
                            <StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user.name)}} 
                                color={selectUser === user.name ? Colors.grey : Colors.Bg2faIn}>
                                <MdOutlinePrivateConnectivity size={30} color={"white"} style={{display: user.status === ChannelStatus.PROTECTED ? "block" : "none"}}/>
                                <StyledContaitePUser key={uuid()}>{user.name}</StyledContaitePUser>
                            </StyledContaiteDivPUser> : <></>
                    ))}
                </StyledContaiteDivUser>
            </StyledContaiteAddUser>
            <StyledContaiteReturn className="addUser">
                <StyledContaiteReturnDiv onClick={handleReturn}>
                    <p>return</p>
                </StyledContaiteReturnDiv>
                <StyledContaiteReturnDiv onClick={handleSend}>
                    <p>add</p>
                </StyledContaiteReturnDiv>
            </StyledContaiteReturn>
            {popupPwd ? <StylePwdProtected>
                            <StyledContaiteClose className="pwd" onClick={handleClosePwd}>
                                    <FaWindowClose size={30} color={Colors.dark1}/>
                                <StyledContaiteViewAddP className="ExploreTitle">Enter Password channel</StyledContaiteViewAddP>
                            </StyledContaiteClose>
                            <StyledInputPwdProtected placeholder="Password of Channel" type="password" onChange={(e) => handChange(e)} 
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        Send();
                                                                                    }else if (e.key === "Escape"){
                                                                                        handleClosePwd();
                                                                                    }}}
                                                                                value={inputPwd} autoFocus/>
            </StylePwdProtected> : <></>}
            </motion.div>
        </StyledContaiteViewAddChan>
    )
}

export default PopupOptionExloreChat;

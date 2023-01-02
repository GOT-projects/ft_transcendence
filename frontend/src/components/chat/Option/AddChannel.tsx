import { useContext, useEffect, useState } from "react";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddChanDiv, StyledContaiteAddChanOption, StyledContaiteAddChanOptionP, StyledContaiteReturnAddButton, StyledContaiteReturnAddButtonP, StyledContaiteReturnAddChannel, StyledContaiteReturnDiv, StyledContaiteViewAddChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { NotifyInter } from "../../interfaces";
import { Notification } from "../../Notify";
import { useNavigate } from "react-router-dom";
import { accountService } from '../../../services/account.service';

enum ChannelStatus {
	PUBLIC = 'PUBLIC',
	PROTECTED = 'PROTECTED',
	PRIVATE = 'PRIVATE'
}

const PopupOptionAddChannel = () =>{
	const socket = useContext(SocketContext);
	const navigate = useNavigate();
	const [inputChan, setInputChan] = useState("");
	const [inputPwd, setInputPwd] = useState("");
	const [selecte, setSelecte] = useState("");
	const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	const codeParam = accountService.getParamsPriv();
	const [typeChannel, setTypeChannel] = useState("");
	const [channelName, setChannelName] = useState("");

	useEffect(() => {
		if (codeParam.get("code") === "Channel" && codeParam.get("setting") === "Change"){
			setTypeChannel("change");
			const tmp = codeParam.get("chanName");
			if (tmp)
				setChannelName(tmp)
		}else if (codeParam.get("name") === "create"){
			setTypeChannel("create");
		}else{
			navigate("/chat")
		}
	},[navigate, codeParam]);

	const handleChangeChan = (event: any) => {
		if (inputChan === "" && event.target.value ==="\n")
			return;
		setInputChan(event.target.value);
	}	

	const handleChangePwd = (event: any) => {
		if (inputPwd === "" && event.target.value ==="\n")
			return;
		if (selecte === "public" || selecte === "private"  || selecte === "")
			return;
		setInputPwd(event.target.value);
	}	

	const handleReturnChan = () => {
		navigate(`/chat?code=add`)
	}
	const handleSelect = (name: string) =>{
		setSelecte(name);
	}

	const handleSend = () =>{
		let chan:GOT.Channel | undefined = undefined;
        const sendChan = inputChan.replace(/ /g, '');
        const sendPwd = inputPwd.replace(/ /g, '');
		if (selecte === "public"){
			if (inputChan === ""){
				setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
			}else{
				chan = {name:sendChan, status: ChannelStatus.PUBLIC, password:undefined}; 
			}
		}else if (selecte === "protected"){
			if (sendChan === ""){
				setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
			}else if (sendPwd === ""){
				setNotify({isOpen: true, message: "Please choose password to your channel", type: "error"})
			}else{
				chan = {name:sendChan, status: ChannelStatus.PROTECTED, password:sendPwd}; 
			}
		}else if (selecte === "private"){
			if (sendChan === ""){
				setNotify({isOpen: true, message: "Please choose name to your channel", type: "error"})
			}else{
				chan = {name:sendChan, status: ChannelStatus.PRIVATE, password:undefined}; 
			}
		}else{
			setNotify({isOpen: true, message: "Please select type of Channel", type: "error"})
		}
		if (chan !== undefined){
			emitSocket.emitCreateChan(socket, chan);
			navigate("/chat");
		}
	}
	const handleSendChange = () =>{
		const chanName = codeParam.get("name");
		if (chanName && inputChan !== "" && selecte !== ""){
			if (chanName && selecte === "public"){
				const tmp:GOT.Channel = {name: inputChan, status: ChannelStatus.PUBLIC, password:undefined}
				emitSocket.emitChanChangeStatus(socket, tmp);
			}else if (chanName && selecte === "private"){
				const tmp:GOT.Channel = {name: inputChan, status: ChannelStatus.PRIVATE, password:undefined}
				emitSocket.emitChanChangeStatus(socket, tmp);
			}else if (chanName && selecte === "protected" && inputPwd !== ""){
				const tmp:GOT.Channel = {name: inputChan, status: ChannelStatus.PROTECTED, password:inputPwd}
				emitSocket.emitChanChangeStatus(socket, tmp);
			}
		} 
		if(chanName && selecte === "public" && inputChan === ""){
			const tmp:GOT.Channel = {name: chanName, status: ChannelStatus.PUBLIC, password:undefined}
			emitSocket.emitChanChangeStatus(socket, tmp);
		}else if (chanName && selecte === "private" && inputChan === ""){
			const tmp:GOT.Channel = {name: chanName, status: ChannelStatus.PRIVATE, password:undefined}
			emitSocket.emitChanChangeStatus(socket, tmp);
		}else if (chanName && selecte === "protected" && inputPwd !== ""){
			const tmp:GOT.Channel = {name: chanName, status: ChannelStatus.PROTECTED, password:inputPwd}
			emitSocket.emitChanChangeStatus(socket, tmp);
		}else if (selecte === "protected" && inputPwd === ""){
			setNotify({isOpen: true, message: "Please choose password to your channel", type: "error"})
		}else{
			if (chanName){
				emitSocket.emitChanChangeName(socket, chanName, inputChan);
				navigate(`/chat?code=Channel`);
				return ;
			}
		}
		if (inputChan !== ""){
			navigate(`/chat?code=Channel&name=${inputChan}`);
		}
		else{
			navigate(`/chat?code=Channel&name=${chanName}`);
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
					{typeChannel === "change" ? 
					<p>Change Channel</p> : <p>Creation Channel</p> }
				</StyledContaiteAddChanDiv>
				<StyledContaiteAddChanDiv>
					{typeChannel === "change" ? 
					<input type="text" placeholder={channelName} value={inputChan} onChange={handleChangeChan} autoFocus/>:
					<input type="text" placeholder="Channel name" value={inputChan} onChange={handleChangeChan} autoFocus/>}
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
						{typeChannel === "change" ?
						<StyledContaiteReturnAddButton onClick={handleSendChange}>
							<StyledContaiteReturnAddButtonP>send</StyledContaiteReturnAddButtonP>
						</StyledContaiteReturnAddButton> : 
						<StyledContaiteReturnAddButton onClick={handleSend}>
							<StyledContaiteReturnAddButtonP>send</StyledContaiteReturnAddButtonP>
						</StyledContaiteReturnAddButton> }
						<StyledContaiteReturnAddButton onClick={handleReturnChan}>
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

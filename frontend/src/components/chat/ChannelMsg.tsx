
import { Dispatch, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { accountService } from "../../services/account.service";
import { GOT } from "../../shared/types";
import { emitSocket } from "../../socket/socketEmit";
import { offSocket } from "../../socket/socketOff";
import { onSocket } from "../../socket/socketOn";
import { SocketContext } from "../../socket/socketPovider";
import { StyledChat, StyledChatInput, StyledChatNameUser, StyledChatPlace, StyledChatSendDiv, StyledChatText, StyledChatTextArea, StyledChatWindow } from "../Styles/StyleChat";
import { StyledEmptyDiv } from "../Styles/StyleViewProfil";


interface IProps {
	profil: GOT.Profile | undefined;
	setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
	chanName: string;
	active: string;
}

const ChannelMsg:FunctionComponent<IProps> = (props:IProps)=> {
	//const [handleSocket, setHandleSocket] = useState<string>('');
	const bottomChat = useRef<null | HTMLDivElement>(null);
	const [inputChat, setInputChat] = useState("");
	const socket = useContext(SocketContext)
	const codeParam: Map<string, string> = accountService.getParamsPriv();

	const [selectChanMsg, setSelectChanMsg] = useState<GOT.MsgChannel[]>([]);
	useEffect(() => {
		//  scroll to bottom every time messages change
		bottomChat.current?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
	}, [socket, setSelectChanMsg, selectChanMsg]);

	useEffect(() =>{
		if (codeParam.get("code") === "Private" && !codeParam.get("name")){
			setSelectChanMsg([]);
		}
	}, [codeParam])
	
	useEffect(() => {
		//receive list message
		if (props.chanName !== ""){
			onSocket.client_channelMsg(socket, setSelectChanMsg, props.chanName);
			return () => {
				offSocket.client_channelMsg(socket);
			} 
		}
	},[socket, setSelectChanMsg, selectChanMsg, props.chanName])


	useEffect(() =>{
        if (codeParam.get("code") !== undefined && codeParam.get("name") !== undefined && codeParam.get("setting") === undefined){
		    emitSocket.emitChannelMsg(socket, codeParam.get("name"))
        }
	}, [socket, props.chanName])

	function handChange(event: any, setInput: any, input: string){
		if (input === "" && event.target.value ==="\n")
			return;
		setInput(event.target.value);
	}	

	const sendMsg = () => {
		if (inputChat === " " || inputChat === "\n" || inputChat === ""){
			return;
		}
		emitSocket.emitChannelMsg_send(socket, codeParam.get("name"), inputChat);
		setInputChat("");
	}

	return (
			<StyledChat className={props.active}>
				<StyledChatWindow>
					<StyledChatTextArea>
						{selectChanMsg?.map((data:GOT.MsgChannel) => (
								<StyledChatPlace key={uuid()} className={data.userFrom.login === props.profil?.userInfos.login ? "send" : "receive"}>
									<StyledChatText>{data.msg}</StyledChatText>
									{data.userFrom.login !== props.profil?.userInfos.login ?
									<StyledChatNameUser>Send by {data.userFrom.login}</StyledChatNameUser> : 
									<StyledEmptyDiv key={uuid()}/>}                                </StyledChatPlace>
						))}
						<div className='field' ref={bottomChat}/>
					</StyledChatTextArea>
					<StyledChatSendDiv className={selectChanMsg ? "active" : "deactive"}>
					<StyledChatInput  name='chat' placeholder="Send message"  onChange={(e) => handChange(e, setInputChat, inputChat)} 
																			onKeyDown={(e) => {
																				if (e.key === 'Enter' && !e.shiftKey){
																					sendMsg();
																				}}}
																			value={inputChat} autoFocus/>
					</StyledChatSendDiv>
				</StyledChatWindow>
			</StyledChat>
	)
}
export default ChannelMsg;

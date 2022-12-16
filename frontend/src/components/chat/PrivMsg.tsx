import { Dispatch, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { accountService } from "../../services/account.service";
import { GOT } from "../../shared/types";
import { emitSocket } from "../../socket/socketEmit";
import { offSocket } from "../../socket/socketOff";
import { onSocket } from "../../socket/socketOn";
import { SocketContext } from "../../socket/socketPovider";
import { StyledChat, StyledChatInput, StyledChatPlace, StyledChatSendDiv, StyledChatText, StyledChatTextArea, StyledChatWindow } from "../Styles/StyleChat";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   userSelect: GOT.User | undefined;
   active: string;
}

const PriveMsg:FunctionComponent<IProps> = (props:IProps)=> {
    const [handleSocket, setHandleSocket] = useState<string>('');
    const bottomChat = useRef<null | HTMLDivElement>(null);
    const [inputChat, setInputChat] = useState("");
    const socket = useContext(SocketContext)
    const codeParam: Map<string, string> = accountService.getParamsPriv();

    const [selectUserMsg, setSelectUserMsg] = useState<GOT.msg[]>();
    useEffect(() => {
        //  scroll to bottom every time messages change
        bottomChat.current?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    }, [socket, setSelectUserMsg, selectUserMsg]);

    useEffect(() =>{
        if (codeParam.get("code") === "Private" && !codeParam.get("name")){
            setSelectUserMsg(undefined);
        }
    }, [codeParam])
    
    useEffect(() => {
        //receive list message
        onSocket.client_privmsg(socket, setSelectUserMsg);
        return () => {
            offSocket.client_privmsg(socket);
        } 
    },[socket, setSelectUserMsg, selectUserMsg])

    useEffect(() => {
        //receive send
        socket.on('client_privmsg_send', (rep:GOT.msg) => {
            if (rep.userFrom.login === props.userSelect?.login){
                if (selectUserMsg){
                    let tmp:GOT.msg[] = selectUserMsg; 
                    tmp.push(rep);
                    setSelectUserMsg(tmp);
                }else{
                    let tmp:GOT.msg[] = []; 
                    tmp.push(rep);
                    setSelectUserMsg(tmp);
                }
            }else{
                emitSocket.emitPrivmsgUsers(socket);
            }
        })
        return () => {
            offSocket.client_privmsg_send(socket);
        } 
    },[socket, setSelectUserMsg, selectUserMsg])

    function handChange(event: any, setInput: any, input: string){
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}	

    const sendMsg = () => {
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            return;
        }
        if (props.profil && props.userSelect){
            const msg:GOT.msg = {userFrom: props.profil.userInfos, userTo:props.userSelect, msg: inputChat};
            emitSocket.emitSendPrivmsg(socket, props.userSelect.login, msg.msg);
        }
        setInputChat("");
    }

    return (
            <StyledChat className={props.active}>
                <StyledChatWindow>
                    <StyledChatTextArea>
                        {selectUserMsg?.map((data:GOT.msg) => (
                                <StyledChatPlace key={uuid()} className={data.userFrom.login === props.profil?.userInfos.login ? "send" : "receive"}>
                                    <StyledChatText>{data.msg}</StyledChatText>
                                </StyledChatPlace>
                        ))}
                        <div className='field' ref={bottomChat}/>
                    </StyledChatTextArea>
                    <StyledChatSendDiv className={selectUserMsg ? "active" : "deactive"}>
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
export default PriveMsg;

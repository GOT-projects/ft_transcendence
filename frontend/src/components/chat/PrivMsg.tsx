import { Dispatch, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { GOT } from "../../shared/types";
import { emitSocket } from "../../socket/socketEmit";
import { SocketContext } from "../../socket/socketPovider";
import { StyledChat, StyledChatInput, StyledChatPlace, StyledChatSendDiv, StyledChatText, StyledChatTextArea, StyledChatWindow } from "../Styles/StyleChat";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   userSelect: GOT.User | undefined;
}

const PriveMsg:FunctionComponent<IProps> = (props:IProps)=> {
    const [handleSocket, setHandleSocket] = useState<string>('');
    const bottomChat = useRef<null | HTMLDivElement>(null);
    const [inputChat, setInputChat] = useState("");
    const socket = useContext(SocketContext)

    const [selectUserMsg, setSelectUserMsg] = useState<GOT.msg[]>();
    useEffect(() => {
        //  scroll to bottom every time messages change
        bottomChat.current?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    }, [setSelectUserMsg, selectUserMsg]);
    
    useEffect(() => {
        //receive list message
        socket.on('client_privmsg', (rep:GOT.msg[]) => {
            if (rep){
                setSelectUserMsg(rep);
            }
        })
        return () => {
            socket.off('client_privmsg');
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
            socket.off('client_privmsg_send');
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
            console.log(msg)
            emitSocket.emitPrivmsg(socket, props.userSelect.login);
            emitSocket.emitSendPrivmsg(socket, props.userSelect.login, msg.msg);
        }
        setInputChat("");
    }

    return (
            <StyledChat>
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
                    <StyledChatInput  name='chat' placeholder="Send message" autoFocus onChange={(e) => handChange(e, setInputChat, inputChat)} 
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey){
                                                                                    sendMsg();
                                                                                }}}
                                                                            value={inputChat}/>
                    </StyledChatSendDiv>
                </StyledChatWindow>
            </StyledChat>
    )
}
export default PriveMsg;

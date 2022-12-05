    import { StyledChat, StyledChatInput, StyledChatPrivAvatar, StyledChatPrive, StyledChatPrivName, StyledChatPlace, 
			StyledChatSendDiv, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, 
			StyledChatWindow, StyledContact, StyledContaite, StyledSender, StyledUser, StyledChatTextArea, StyledMenuNav, StyledMenuDiv, 
			StyledMenuSwitch, StyledAddInput, StyledAddInputdiv, StyledAddInputdivButton } from '../components/Styles/StyleChat';
import React, {Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { GrAddCircle } from 'react-icons/gr';
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';
import { SocketContext } from '../socket/socketPovider';
import { GOT } from '../shared/types';
import { emitSocket } from '../socket/socketEmit';
import { MdOutlineBlock } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import ProfilView from '../components/popup/ProfilView';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Chat:FunctionComponent<IProps> = (props:IProps)=> {
    const [popuProfil, setPopupProfil] = useState(false);
    const [popupUser, setPopupUser] = useState<GOT.User>();
    const socket = useContext(SocketContext)
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [navActive, setNavActive] = useState("UnActiveMenu");
    const [chatSwitch, setChatSwitch] = useState<string>('private');
    const [selectFriend, setSelectFriend] = useState<string>('');
    const endRef = React.useRef<HTMLInputElement>(null);
    const [inputChat, setInputChat] = useState("");
    const [inputContact, setInputContact] = useState("");
    const [inputChannel, setInputChannel] = useState("");

    const [usersList, setUsersList] = useState<GOT.User[]>();
    const [selectUserMsg, setSelectUserMsg] = useState<GOT.msg[]>();
    const [selectUser, setSelectUser] = useState<GOT.User>();
    const [friends, setFriends] = useState<GOT.Friend[]>();

    useEffect(() => {
        socket.on('client_friends', (rep:GOT.Friend[]) => {
            setFriends(rep);
        })
        return () => {
            socket.off('client_friends');
        } 
    },[socket])

    useEffect(() => {
        socket.on('client_privmsg', (rep:GOT.msg[]) => {
            if (rep){
                setSelectUserMsg(rep);
            }
        })
        return () => {
            socket.off('client_privmsg');
        } 
    },[socket])

    useEffect(() => {
        socket.on('client_privmsg_send', (rep:GOT.msg) => {
            console.log("receive priv msg", rep);
            if (rep){
                let tmp = selectUserMsg;
                tmp?.push(rep);
                setSelectUserMsg(tmp);
            }
        })
        return () => {
            socket.off('client_privmsg_send');
        } 
    },[socket])

    useEffect(() => {
        socket.on('client_users', (rep:GOT.User[]) => {
            if (rep){
                setUsersList(rep);
            }
        })
        return () => {
            socket.off('client_users');
        } 
    },[socket])

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])

    useEffect(() => {
        emitSocket.emitUsers(socket);
    }, [socket])

    function handChange(event: any, setInput: any, input: string){
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}	

    const sendMsg = () => {
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            return;
        }
        console.log(selectUser);
        if (props.profil && selectUser !== undefined){
            const msg:GOT.msg = {userFrom: props.profil.userInfos, userTo:selectUser, msg: inputChat};
            console.log("Emit send", msg)
            emitSocket.emitSendPrivmsg(socket, msg.userTo.login, msg.msg);
            let tmp = selectUserMsg;
            tmp?.push(msg);
            setSelectUserMsg(tmp);
        }
        setInputChat("");
    }

    const navMenu = () => {
        if (navActive === "ActiveMenu") {
            setNavActive("UnActiveMenu");
        } else setNavActive("ActiveMenu");
    }

    const addContact = () =>{
        if (inputContact === " " || inputContact === "\n" || inputContact === ""){
            return;
        }
        emitSocket.emitDemandFriend(socket, inputContact);
        setInputContact('')
    }
	
    const addChannel = () =>{
        //TODO check contact before add
        if (inputChannel === " " || inputChannel === "\n" || inputChannel === ""){
            return;
        }
        setNotify({isOpen: true, message: 'Channel ' + inputChannel + ' is add', type:'success'});
        setInputChannel('')
    }

    const handleSelectFriend = (name:string) => {
        const user = usersList?.filter((user) => user.login === name);
        if (user){
            const tmp:GOT.User = user[0];
            setSelectUser(tmp);
        }
        emitSocket.emitPrivmsg(socket, name);
    }

    const handleViewProfil = (name: string) =>{
        const user = usersList?.filter((user) => user.login === name);
        if (user){
            const tmp:GOT.User = user[0];
            setPopupUser(tmp);
            setPopupProfil(true);
        }

    }

    const handleBlockUser = (name: string) => {
        emitSocket.emitBlockUser(socket, name);
    }

	return (
		<React.Fragment>
			<BackgroundAnimate name="contact"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuDisable} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuActive}
                    notify={notify}
                    setNotify={setNotify}
                    profil={props.profil}
                    setProfil={props.setProfil}
             />

            <StyledContaite>
                <StyledMenuSwitch>
                    <StyledMenuNav className={navActive} onClick={navMenu}>
                        <StyledMenuDiv className={navActive}></StyledMenuDiv>
                        <StyledMenuDiv className={navActive}></StyledMenuDiv>
                        <StyledMenuDiv className={navActive}></StyledMenuDiv>
                    </StyledMenuNav>
                    <StyledChatSwithButton color={chatSwitch === "private" ? Colors.ChatMenuButtonHover : "transparent"} 
									onClick={() => setChatSwitch("private")}>Private</StyledChatSwithButton>
                    <StyledChatSwithButton color={chatSwitch === "channel" ? Colors.ChatMenuButtonHover : "transparent"}
									onClick={() => setChatSwitch("channel")}>Channel</StyledChatSwithButton>
                </StyledMenuSwitch>
                <StyledContact className={navActive}>
                    <StyledChatSwith> 
                        <StyledChatSwithButton color={chatSwitch === "private" ? Colors.ChatMenuButtonHover : "transparent"}
									onClick={() => setChatSwitch("private")}>Private</StyledChatSwithButton>
                        <StyledChatSwithButton color={chatSwitch === "channel" ? Colors.ChatMenuButtonHover : "transparent"} 
									onClick={() => setChatSwitch("channel")}>Channel</StyledChatSwithButton>
                    </StyledChatSwith>
                    <StyledChatSep/>
                    {chatSwitch === "private" ?
                    <StyledAddInputdiv>
                        <StyledAddInput type="text" value={inputContact} placeholder='Add contact' onChange={(e) => handChange(e, setInputContact, inputContact)}
                                                                                                   onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter'){
                                                                                                        addContact();
                                                                                                    }}}/>
                        <StyledAddInputdivButton onClick={() => addContact()}>
                            <GrAddCircle size={"40px"}/>
                        </StyledAddInputdivButton>
                    </StyledAddInputdiv> :
                    <StyledAddInputdiv>
                        <StyledAddInput type="text" value={inputChannel} placeholder='Add channel' onChange={(e) => handChange(e, setInputChannel, inputChannel)}
                                                                                                   onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter'){
                                                                                                        addChannel();
                                                                                                    }}}/>
                        <StyledAddInputdivButton onClick={() => addChannel()}>
                            <GrAddCircle size={"40px"}/>
                        </StyledAddInputdivButton>
                    </StyledAddInputdiv>
                    }
                    <StyledChatPrive className={navActive}>
                <>
                    {chatSwitch === "private" ? friends?.map((user:GOT.Friend) =>(
                        <StyledUser key={uuid()} color={user.username === selectUser?.username ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => {handleSelectFriend(user.username)}}>
                            <StyledChatPrivAvatar profil={user.urlImg}/>
                        <StyledChatPrivName key={uuid()}>{user.username}</StyledChatPrivName>
                        <StyledChatSettingButton onClick={() => {handleViewProfil(user.login)}}>
                            <CgProfile className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        <StyledChatSettingButton onClick={() => {handleBlockUser(user.login)}}>
                            <MdOutlineBlock className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        </StyledUser>
                    )) : ""}
                </>
                <React.Fragment>
                    {chatSwitch === "channel" ? friends?.map((user:GOT.Friend) =>(
                        <StyledUser key={uuid()} color={user.username === selectFriend ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => {handleSelectFriend(user.username)}}>
                        <StyledChatPrivName key={uuid()}>channel</StyledChatPrivName>
                        <StyledChatSettingButton onClick={() => {console.log("ok")}}>
                            <AiFillSetting className='setting' size={30} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        </StyledUser>
                    )): ""}
                </React.Fragment>
                    </StyledChatPrive>
                </StyledContact>

                <StyledChat>
                    <StyledChatWindow>
                        <StyledChatTextArea>
                            {selectUserMsg?.map((data:GOT.msg) => (
                                    <StyledChatPlace key={uuid()} className={data.userFrom.login === props.profil?.userInfos.login ? "send" : "receive"}>
                                        <StyledChatText>{data.msg}</StyledChatText>
                                    </StyledChatPlace>
                            ))}
                            <div className='field' ref={endRef}/>
                        </StyledChatTextArea>
                        <StyledChatSendDiv className={selectUserMsg ? "active" : "deactive"}>
                        <StyledChatInput  name='chat' placeholder="Send message" onChange={(e) => handChange(e, setInputChat, inputChat)} 
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        sendMsg();
                                                                                    }}}
                                                                                value={inputChat}/>
                        <StyledSender>
                            <AiOutlineSend size={30} color={Colors.primary} onClick={() => sendMsg()}/>
                        </StyledSender>
                        </StyledChatSendDiv>
                    </StyledChatWindow>
                </StyledChat>
            </StyledContaite>
            <Notification notify={notify} setNotify={setNotify}/>
            {popuProfil ? <ProfilView login={popupUser} profil={props.profil} setPopupProfil={setPopupProfil}/> : <> </>}
			<Footer/>
		</React.Fragment>
	)
}

export default Chat;

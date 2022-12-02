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
import { UserListPrivate, DataMesssage } from '../components/interfaces';
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';
import { SocketContext, useSocket } from '../socket/socketPovider';
import { Socket } from 'socket.io-client';
import { GOT } from '../shared/types';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Chat:FunctionComponent<IProps> = (props:IProps)=> {
    const socket = useContext(SocketContext)
	const url = window.location.href;
	let params = (new URL(url)).searchParams;
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [navActive, setNavActive] = useState("UnActiveMenu");
    const [chatSwitch, setChatSwitch] = useState<string>('private');
    const [selectFriend, setSelectFriend] = useState<string>('');
    const endRef = React.useRef<HTMLInputElement>(null);
    const [inputChat, setInputChat] = useState("");
    const [inputContact, setInputContact] = useState("");
    const [inputChannel, setInputChannel] = useState("");

    const [selectUser, setSelectUser] = useState<DataMesssage[]>();
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
        socket.emit('server_friends', "");
    }, [socket])

    //open chat user when is select by friendList
    // if (!!params.get("code")){
    //     const username = params.get("code")
    //     chatUser.map((user) => {
    //         if (user.user === username){
    //             user.active = true;
    //         }else{
    //             user.active = false;
    //         }
    //     })
    // }

    function handChange(event: any, setInput: any, input: string){
        if (input === "" && event.target.value ==="\n")
            return;
		setInput(event.target.value);
	}	

    const sendMsg = () => {
        //TODO send to db by socket
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            setInputChat("");
            return;
        }
        console.log("Message Emit")
        setInputChat("");
    }

    const insertMsg = (user:string, addmsg:DataMesssage)=>{
        let dataUser:DataMesssage[]|undefined;
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
        socket.emit('server_demand_friend', {login: inputContact})
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
        setSelectFriend(name);
    }

	return (
		<React.Fragment>
			<BackgroundAnimate name="contact"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuActive} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuDisable}
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
                        <StyledUser key={uuid()} color={user.username === selectFriend ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => {handleSelectFriend(user.username)}}>
                            <StyledChatPrivAvatar/>
                        <StyledChatPrivName key={uuid()}>{user.username}</StyledChatPrivName>
                        </StyledUser>
                    )) : ""}
                </>
                <>
                    {chatSwitch === "channel" ? friends?.map((user:GOT.Friend) =>(
                        <StyledUser key={uuid()} color={user.username === selectFriend ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => {handleSelectFriend(user.username)}}>
                        <StyledChatPrivName key={uuid()}>channel</StyledChatPrivName>
                        <StyledChatSettingButton >
                            <AiFillSetting className='setting' size={15} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        </StyledUser>
                    )): ""}
                </>
                    </StyledChatPrive>
                </StyledContact>

                <StyledChat>
                    <StyledChatWindow>
                        <StyledChatTextArea>
                            {/* {selectUser?.map((data:DataMesssage) => (
                                    <StyledChatPlace key={data.id} className={data.from === localStorage.getItem("login") ? "send" : "receive"}>
                                        <StyledChatText>{data.message}</StyledChatText>
                                    </StyledChatPlace>
                            ))} */}
                            <div className='field' ref={endRef}/>
                        </StyledChatTextArea>
                        <StyledChatSendDiv className={selectUser ? "active" : "deactive"}>
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
			<Footer/>
		</React.Fragment>
	)
}

export default Chat;

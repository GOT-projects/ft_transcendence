import React, {useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import { StyledChat, StyledChatInput, StyledChatPrivAvatar, StyledChatPrive, StyledChatPrivName, StyledChatPlace, StyledChatSendDiv, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, StyledChatWindow, StyledContact, StyledContaite, StyledSender, StyledUser, StyledChatTextArea, DisplayPrive, DisplayChannel } from '../components/Styles/StyleChat';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { UserListPrivate, DataMesssage } from '../components/interfaces';
import { v4 as uuid } from 'uuid';


const Chat = () => {
    const [chatSwitch, setChatSwitch] = useState<string>('');
    const endRef = React.useRef<HTMLInputElement>(null);
    const [inputChat, setInputChat] = useState("");
    const [selectUser, setSelectUser] = useState<DataMesssage[]>();
    const [chatUser, setChatUser] = useState<UserListPrivate[]>([
    {id: uuid(), user: "waxdred", mute:false, block: false, active: false, data:[
        {id: uuid(), message: "salut", from: "pc"},
        {id: uuid(), message: "ca va?", from: "pc"},
        {id: uuid(), message: "super et toi?", from: "waxdred"},
        {id: uuid(), message: "quoi de neuf", from: "waxdred"},
    ]},
    {id: uuid(), user: "rcuminal", mute:false, block: false, active: false, data:[]},
    {id: uuid(), user: "aartiges", mute:false, block: false, active: false, data:[
        {id: uuid(), message: "test", from: "pc"},
        {id: uuid(), message: "de merde", from: "pc"},
        {id: uuid(), message: "super et toi?", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi direkjkjdaskfjkasjfkldjsakjf jkj kjkl ", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
        {id: uuid(), message: "je sais pas quoi dire", from: "waxdred"},
    ]}
    ]);

    function handChange(event: any){
        if (inputChat === "" && event.target.value ==="\n")
            return;
		setInputChat(event.target.value);
	}	

    const handleUserSelector = (user: string) => {
        const newArr = chatUser.map(ls => {
            if (ls.user === user) {
                ls.active = true;
                return ls
            } else {
                ls.active = false;
                return ls
            }
        });
        getuserSelect();
        setChatUser(newArr);
    }

    const getuserSelect = () => {
        chatUser.map(ls => {
            if (ls.active === true)
                setSelectUser(ls.data);
        })
    }

    const sendMsg = () => {
        //TODO send to db by socket
        if (inputChat === " " || inputChat === "\n" || inputChat === ""){
            setInputChat("");
            return;
        }
        let newMessage = selectUser;
        newMessage?.push({id: uuid(), message: inputChat, from: "pc"})
        setSelectUser(newMessage)
        setInputChat("");
    }

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatUser, selectUser, inputChat])
	
	return (
		<React.Fragment>
			<BackgroundAnimate/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuDisable} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuActive}/>
            <StyledContaite>
                <StyledContact>
                    <StyledChatSwith> 
                        <StyledChatSwithButton onClick={() => setChatSwitch("private")}>Private</StyledChatSwithButton>
                        <StyledChatSwithButton onClick={() => setChatSwitch("channel")}>Channel</StyledChatSwithButton>
                    </StyledChatSwith>
                    <StyledChatSep/>
                    <StyledChatPrive>
                <>
                    {chatSwitch === "private" ? chatUser.map((user:UserListPrivate) =>(
                        <StyledUser key={user.id} color={user.active ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => handleUserSelector(user.user)}>
                            <StyledChatPrivAvatar/>
                        <StyledChatPrivName key={user.id}>{user.user}</StyledChatPrivName>
                        <StyledChatSettingButton >
                            <AiFillSetting className='setting' size={15} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        </StyledUser>
                    )) : ""}
                </>
                <>
                    {chatSwitch === "channel" ? chatUser.map((user:UserListPrivate) =>(
                        <StyledUser key={user.id} color={user.active ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => handleUserSelector(user.user)}>
                        <StyledChatPrivName key={user.id}>channel</StyledChatPrivName>
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
                            {selectUser?.map((data:DataMesssage) => (
                                    <StyledChatPlace key={data.id} className={data.from === "pc" ? "send" : "receive"}>
                                        <StyledChatText>{data.message}</StyledChatText>
                                    </StyledChatPlace>
                            ))}
                            <div className='field' ref={endRef}/>
                        </StyledChatTextArea>
                        </StyledChatWindow>
                        <StyledChatSendDiv className={selectUser ? "active" : "deactive"}>
                        <StyledChatInput  name='chat' placeholder="Send message" onChange={(e) => handChange(e)} 
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        sendMsg();
                                                                                    }                                                                                }}
                                                                                value={inputChat}/>
                        <StyledSender>
                            <AiOutlineSend size={30} color={Colors.primary}/>
                        </StyledSender>
                    </StyledChatSendDiv>
                </StyledChat>
            </StyledContaite>

			<Footer/>
		</React.Fragment>
	)
}

export default Chat;

import React, { useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import { StyledChat, StyledChatInput, StyledChatPrivAvatar, StyledChatPrive, StyledChatPrivName, StyledChatReveive, StyledChatSend, StyledChatSendDiv, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, StyledChatWindow, StyledContact, StyledContaite, StyledSender, StyledUser } from '../components/Styles/StyleChat';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { UserListPrivate } from '../components/interfaces';


const Chat = () => {
    const [chatUser, setChatUser] = useState<UserListPrivate[]>([
    {id: "321739821", user: "waxdred", mute:false, block: false, active: true, data:[
        {message: "salut", from: "pc"},
        {message: "ca va?", from: "pc"},
        {message: "super et toi?", from: "waxdred"},
        {message: "quoi de neuf", from: "waxdred"},
    ]},
    {id: "321739881", user: "rcuminal", mute:false, block: false, active: false, data:[]},
    {id: "321739891", user: "aartiges", mute:false, block: false, active: false, data:[
        {message: "salut", from: "pc"},
        {message: "ca va?", from: "pc"},
        {message: "super et toi?", from: "waxdred"},
        {message: "quoi de neuf", from: "waxdred"},
    ]}
    ]);

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
        setChatUser(newArr);
    }
	
	return (
		<React.Fragment>
			<BackgroundAnimate/>
            <Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuDisable} colorLeadBoard={Colors.MenuDisable} colorChat={Colors.MenuActive}/>
            <StyledContaite>
                <StyledContact>
                    <StyledChatSwith>
                        <StyledChatSwithButton>Private</StyledChatSwithButton>
                        <StyledChatSwithButton>Channel</StyledChatSwithButton>
                    </StyledChatSwith>
                    <StyledChatSep/>
                    <StyledChatPrive>
                <>
                    {chatUser.map((user:UserListPrivate) =>(
                        <StyledUser key={user.id} color={user.active ? Colors.ChatMenuButton : Colors.ChatMenu} onClick={() => handleUserSelector(user.user)}>
                            <StyledChatPrivAvatar/>
                        <StyledChatPrivName key={user.id}>{user.user}</StyledChatPrivName>
                        <StyledChatSettingButton >
                            <AiFillSetting size={25} color={Colors.ChatMenuButtonText}/>
                        </StyledChatSettingButton>
                        </StyledUser>
                    ))}
                </>
                    </StyledChatPrive>
                </StyledContact>

                <StyledChat>
                    <StyledChatWindow>
                        <StyledChatSend>
                            <StyledChatText> salut comment va tu?</StyledChatText>
                        </StyledChatSend>
                        <StyledChatReveive>
                            <StyledChatText> Saltu a toi je sui nouveau ici tu peux m'aider stp </StyledChatText>
                        </StyledChatReveive>
                    </StyledChatWindow>
                    <StyledChatSendDiv>
                        <StyledChatInput placeholder="Send message"/>
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

import React, {useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import { StyledChat, StyledChatInput, StyledChatPrivAvatar, StyledChatPrive, StyledChatPrivName, StyledChatPlace, StyledChatSendDiv, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, StyledChatWindow, StyledContact, StyledContaite, StyledSender, StyledUser } from '../components/Styles/StyleChat';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { UserListPrivate, DataMesssage } from '../components/interfaces';


const Chat = () => {
    const [selectUser, setSelectUser] = useState<DataMesssage[]>()
    const [chatUser, setChatUser] = useState<UserListPrivate[]>([
    {id: "321739821", user: "waxdred", mute:false, block: false, active: false, data:[
        {message: "salut", from: "pc"},
        {message: "ca va?", from: "pc"},
        {message: "super et toi?", from: "waxdred"},
        {message: "quoi de neuf", from: "waxdred"},
    ]},
    {id: "321739881", user: "rcuminal", mute:false, block: false, active: false, data:[]},
    {id: "321739891", user: "aartiges", mute:false, block: false, active: false, data:[
        {message: "test", from: "pc"},
        {message: "de merde", from: "pc"},
        {message: "super et toi?", from: "waxdred"},
        {message: "je sais pas quoi dire", from: "waxdred"},
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
        getuserSelect();
        setChatUser(newArr);
    }

    const getuserSelect = () => {
        chatUser.map(ls => {
            if (ls.active === true)
                setSelectUser(ls.data);
        })
    }
    console.log(selectUser)
	
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
                        <>
                            {selectUser?.map((data:DataMesssage) => (
                                    <StyledChatPlace className={data.from === "pc" ? "send" : "receive"}>
                                        <StyledChatText>{data.message}</StyledChatText>
                                    </StyledChatPlace>
                            ))}
                        </>
                        <StyledChatSendDiv>
                        <StyledChatInput placeholder="Send message"/>
                        <StyledSender>
                            <AiOutlineSend size={30} color={Colors.primary}/>
                        </StyledSender>
                    </StyledChatSendDiv>
                    </StyledChatWindow>
                </StyledChat>
            </StyledContaite>

			<Footer/>
		</React.Fragment>
	)
}

export default Chat;

import React, {useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import { StyledChat, StyledChatInput, StyledChatPrivAvatar, StyledChatPrive, StyledChatPrivName, StyledChatPlace, StyledChatSendDiv, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, StyledChatWindow, StyledContact, StyledContaite, StyledSender, StyledUser, StyledChatTextArea } from '../components/Styles/StyleChat';
import { AiFillSetting, AiOutlineSend } from 'react-icons/ai';
import { UserListPrivate, DataMesssage } from '../components/interfaces';


const Chat = () => {
    const [selectUser, setSelectUser] = useState<DataMesssage[]>()
    const [chatUser, setChatUser] = useState<UserListPrivate[]>([
    {id: "321739821", user: "waxdred", mute:false, block: false, active: false, data:[
        {id: "172871827189", message: "salut", from: "pc"},
        {id: "172871827199", message: "ca va?", from: "pc"},
        {id: "172871829189", message: "super et toi?", from: "waxdred"},
        {id: "172871927189", message: "quoi de neuf", from: "waxdred"},
    ]},
    {id: "321739881", user: "rcuminal", mute:false, block: false, active: false, data:[]},
    {id: "321739891", user: "aartiges", mute:false, block: false, active: false, data:[
        {id: "71283217382718378127", message: "test", from: "pc"},
        {id: "71283217282318378127", message: "de merde", from: "pc"},
        {id: "71283227382718378127", message: "super et toi?", from: "waxdred"},
        {id: "71283217322718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217323718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217324718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217325718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217326718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217327718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217328718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "71283217329718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173210718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173211718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173212718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173213718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173214718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173215718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173216718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173217718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173218718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173219718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173220718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173221718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173222718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173223718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173224718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173225718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173226718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173227718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173228718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173229718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173230718378127", message: "je sais pas quoi dire", from: "waxdred"},
        {id: "712832173231718378127", message: "je sais pas quoi dire", from: "waxdred"},
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
                        <StyledChatTextArea>
                            {selectUser?.map((data:DataMesssage) => (
                                    <StyledChatPlace key={data.id} className={data.from === "pc" ? "send" : "receive"}>
                                        <StyledChatText>{data.message}</StyledChatText>
                                    </StyledChatPlace>
                            ))}
                        </StyledChatTextArea>
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

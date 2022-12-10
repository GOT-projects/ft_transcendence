    import { StyledChat, StyledChatPrive, StyledChatSep, StyledChatSettingButton, StyledChatSwith, StyledChatSwithButton, StyledChatText, StyledContact, StyledContaite, StyledChatSwithTile } from '../components/Styles/StyleChat';
import React, {Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { SocketContext } from '../socket/socketPovider';
import { emitSocket } from '../socket/socketEmit';
import ProfilView from '../components/popup/ProfilView';
import { GOT } from '../shared/types';

import PriveMsg from '../components/chat/PrivMsg';
import PriveUserMenu from '../components/chat/PrivUsers';
import { accountService } from '../services/account.service';
import MenuChat from '../components/chat/Menu';
import { onSocket } from '../socket/socketOn';
import { offSocket } from '../socket/socketOff';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Chat:FunctionComponent<IProps> = (props:IProps)=> {
    const socket = useContext(SocketContext);
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [active, setActive] = useState("UnActiveMenu");
    const [login, setLogin] = useState<string>("");

    const [add, setAdd] =  useState(false);
    const [chatSwitch, setChatSwitch] = useState<string>('private');
    const [histo, setHisto] = useState<GOT.HistoryParties>();
    const [popuProfil, setPopupProfil] = useState(false);

    const [usersList, setUsersList] = useState<GOT.User[]>();
    const [selectUser, setSelectUser] = useState<GOT.User>();
    const [friends, setFriends] = useState<GOT.User[]>();
    const [lstFriends, setLstFriends] = useState<GOT.Friend[]>()
    
    const codeParam: Map<string, string> = accountService.getParamsPriv();


    useEffect(() => {
        onSocket.profil_login(socket, setHisto);
        return () => {
            offSocket.profil_login(socket);
        }
    }, [histo]);

    useEffect(() => {
        (async () => {
            await onSocket.client_privmsg_users(socket, setFriends);
        })();
    },[socket, friends, setFriends])
    
    useEffect(() => {
        onSocket.client_friends(socket, setLstFriends);
        return () => {
            offSocket.client_friends(socket);
        } 
    },[socket, lstFriends, setLstFriends])

    useEffect(() => {
        onSocket.client_privmsg_send(socket, selectUser)
        return () => {
            offSocket.client_privmsg_send(socket);
        } 
    },[socket])

    useEffect(() => {
        onSocket.client_users(socket, setUsersList);
        return () => {
            offSocket.client_users(socket);
        } 
    },[socket])

    useEffect(() => {
        emitSocket.emitFriends(socket);
    }, [socket])

    useEffect(() => {
        emitSocket.emitPrivmsgUsers(socket);
    }, [])


    useEffect(() => {
        emitSocket.emitUsers(socket);
    }, [socket])

    const handleSelectFriend = (name:string) => {
        const user = friends?.filter((user) => user.login === name);
        if (user){
            const tmp:GOT.User = user[0];
            if (selectUser !== tmp){
                setSelectUser(tmp);
                setAdd(false);
                emitSocket.emitPrivmsg(socket, name);
            }
        }
    }

    useEffect(() =>{
        if (codeParam.get("code") === "Priv" && codeParam.get("name")){
            const name = codeParam.get("name");
            const check = friends?.filter((friend) => friend.login === name)
            if (check && check?.length !== 0){
                handleSelectFriend(check[0].login);
                setAdd(false);
            }
        }
        else if (codeParam.get("code") === "Priv"){
            setSelectUser(undefined);
            setAdd(false);
        }else if (codeParam.get("code") === "add"){
            console.log("add")
            setAdd(true);
        }else{
            setAdd(false);
        }
    }, [codeParam])


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
                <MenuChat  friends={friends} profil={props.profil} setFriends={setFriends} setProfil={props.setProfil} 
                           chatSwitch={chatSwitch} setChatSwitch={setChatSwitch} 
                           active={active} setActive={setActive}
                           listUser={usersList} add={add} setAdd={setAdd}/>
                <StyledContact className={active}>
                    <StyledChatSwith> 
                        <StyledChatSwithTile>{chatSwitch}</StyledChatSwithTile>
                    </StyledChatSwith>
                    <StyledChatSep/>
                    <StyledChatPrive >
                    {chatSwitch === "private" ? <PriveUserMenu friends={friends} setFriends={setFriends} selectUser={selectUser} 
                                                               setActive={setActive} profil={props.profil}
                                                               setSelectUser={setSelectUser} userFriend={lstFriends}
                                                               setLogin={setLogin}
                                                               setPopupProfil={setPopupProfil} popuProfil={popuProfil}/> : <></>}
                    </StyledChatPrive>
                </StyledContact>
                <PriveMsg active={active} profil={props.profil} setProfil={props.setProfil} userSelect={selectUser}/>
            </StyledContaite>
            <Notification notify={notify} setNotify={setNotify}/>
            {popuProfil ? <ProfilView login={login} setPopupProfil={setPopupProfil}/> : <> </>}
           <Footer/>
		</React.Fragment>
	)
}
export default Chat;

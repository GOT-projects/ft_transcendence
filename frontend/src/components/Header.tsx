import {StyledHeader, StyleMenusHeader ,StyleMenuHeader, StyleNavToggler, StyleNavTogglerIcon, StyleMenuHeaderProfil , StyleMenuHeaderNotity, StyleNav, StyleMenuHeaderNotityResp, StyleMenuHeaderProfilResp, StyleHeaderUserList, StyleHeaderUserListResp} from "./Styles/StyledHeader"
import {Dispatch, FunctionComponent, useState, useEffect, useCallback, useContext } from "react";
import { IoIosNotifications, IoMdNotificationsOff } from 'react-icons/io';
import ProfileMenu from "./MenuProfilHeader";
import {NotifyInter} from "../components/interfaces"
import { Colors } from "./Colors";
import PopupNotifUser from "./popup/NotifyUser";
import PopupListFriends from "./popup/FriendLst";
import { SocketContext } from "../socket/socketPovider";
import { GOT } from "../shared/types";
import { emitSocket } from "../socket/socketEmit";
import SetupOtc from "./popup/SetupOtc";
import { onSocket } from "../socket/socketOn";
import { offSocket } from "../socket/socketOff";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/account.service";

interface IProps {
   notify: NotifyInter;
   setNotify: Dispatch<any>;
   colorHome:string;
   colorGame:string;
   colorLeadBoard:string;
   colorChat:string;
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Header:FunctionComponent<IProps> = (props:IProps)=> {
    //call socket; 
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [friendList, setFriendList] = useState(false);
    const [notifMenu, setNotifMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [otc, setOtc] = useState(false);
    let notif = false;

    if (props.profil?.notif.length !== 0 || props.profil.notifChannel.length !== 0 || props.profil.gameDemands.length !== 0){
        notif = true;
    }
    //Socket refresh token
    useEffect(() => {
        onSocket.client_jwt(socket);
    }, [socket])

    //Socket get erreur from server 
    useEffect(() => {
        onSocket.error_client(socket, props.setNotify);
    }, [socket])

    //Socket get info from server 
    useEffect(() => {
        onSocket.info_client(socket, props.setNotify);
    }, [socket])

    //Socket get info from server 
    useEffect(() => {
        onSocket.warning_client(socket, props.setNotify)
    }, [socket])

    //Update info user all last data and Update if data are changed
    useEffect(() => {
        onSocket.client_profil(socket, props.setProfil)
        return () => {
            offSocket.client_profil(socket);
        }
    }, [socket])

    //get profile info
    useEffect(() => {
        // socket.emit('server_profil', "profil");
        emitSocket.emitProfil(socket);
    }, [socket]);

    //respond menu
    const [active, setActive] = useState("UnActiveMenu");

    //scrool bar close open page
    const handleScroll = useCallback(() => {
        setActive("UnActiveMenu");
        setProfileMenu(false);
        setNotifMenu(false);
        setFriendList(false);
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
    }, [handleScroll])

    const navMenu = () => {
        if (active === "ActiveMenu") {
            setActive("UnActiveMenu");
        } else {
            setActive("ActiveMenu");
            setNotifMenu(false);
            setProfileMenu(false);
            setFriendList(false);
            setOtc(false);
        }
    }

    const handleFriendList = () => {
        if (friendList === true){
            setFriendList(false);
        }else if (friendList === false){
            setActive("UnActiveMenu");
            setProfileMenu(false);
            setNotifMenu(false);
            setFriendList(true);
            setOtc(false);
        }
    }

    const handleMenuProfil = () => {
        if (profileMenu === true){
            setProfileMenu(false);
        }else if (profileMenu === false){
            setActive("UnActiveMenu");
            setProfileMenu(true);
            setNotifMenu(false);
            setFriendList(false);
            setOtc(false);
        }
    }

    const handleMenuNotif = () => {
        let url = (new URL(window.location.href));
        if (notifMenu === true){
            const param = accountService.replaceParamsTo("notif", "false");
            setNotifMenu(false);
            navigate(`${url.pathname}${param}`);
        }else if (notifMenu === false){
            const param = accountService.replaceParamsTo("notif", "true");
            setActive("UnActiveMenu");
            setNotifMenu(true);
            setProfileMenu(false);
            setFriendList(false);
            setOtc(false);
            navigate(`${url.pathname}${param}`);
        }
    }

	return (
        <StyledHeader>
            <StyleMenusHeader className={active}>
                <StyleMenuHeader colortext={props.colorHome} text={"Home"} to='/'>Home</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorGame}text={"Game"}to="/game">Game</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorLeadBoard}text={"LeaderBoard"} to='/leaderboard'>LeaderBoard</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorChat} text={"Chat"}to='/chat?code=Priv'>Chat</StyleMenuHeader>
                <StyleMenuHeaderNotity colorIcon={notif ? Colors.NotifActive : Colors.NotifUnactive}>
                    {notif ? <IoIosNotifications size={"22px"} onClick={handleMenuNotif}/> : <IoMdNotificationsOff size={"22px"}/>}
                </StyleMenuHeaderNotity>
                <StyleHeaderUserList onClick={handleFriendList}/>
                <StyleMenuHeaderProfil onClick={handleMenuProfil} profil={props.profil?.userInfos.urlImg}/>        
                {profileMenu ? <ProfileMenu notify={props.notify} 
                                            setNotify={props.setNotify} 
                                            setProfileMenu={setProfileMenu}
                                            setOtc={setOtc}
                                            profil={props.profil}
                                            /> : <></>}
                {notifMenu ? <PopupNotifUser notify={props.notify} 
                                             setNotify={props.setNotify} 
                                             profil={props.profil}
                                             setNotifyMenu={setNotifMenu}
                                             /> : <></>}
                </StyleMenusHeader>
            <StyleNav>
                <StyleMenuHeaderNotityResp colorIcon={notif ? Colors.NotifActive : Colors.NotifUnactive}>
                    {notif ? <IoIosNotifications size={"22px"} onClick={handleMenuNotif}/> : <IoMdNotificationsOff size={"22px"}/>}
                </StyleMenuHeaderNotityResp>
                <StyleHeaderUserListResp onClick={handleFriendList}/>
                <StyleMenuHeaderProfilResp onClick={handleMenuProfil} profil={props.profil?.userInfos.urlImg}/>        
                <StyleNavToggler onClick={navMenu} className={active}>
                    <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                    <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                    <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                </StyleNavToggler>
                {profileMenu ? <ProfileMenu notify={props.notify} 
                                            setOtc={setOtc}
                                            setNotify={props.setNotify}
                                            setProfileMenu={setProfileMenu}
                                            profil={props.profil}
                                            /> : <></>}
                {notifMenu ? <PopupNotifUser notify={props.notify} 
                                             setNotify={props.setNotify} 
                                             profil={props.profil}
                                             setNotifyMenu={setNotifMenu}
                                             /> : <></>}
                {friendList ? <PopupListFriends setFriendsLst={setFriendList} profil={props.profil}/> : <></>}
            </StyleNav>
                {otc ? <SetupOtc setOtc={setOtc}/> : <></>}
        </StyledHeader>
	)
}

export default Header;


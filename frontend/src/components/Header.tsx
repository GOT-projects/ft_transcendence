import {StyledHeader, StyleMenusHeader ,StyleMenuHeader, StyleNavToggler, StyleNavTogglerIcon, StyleMenuHeaderProfil, StyleMenuHeaderLoggout, StyleMenuHeaderNotity} from "./Styles/StyledHeader"
import {Dispatch, FunctionComponent, useState, useEffect, useCallback } from "react";
import { accountService } from "../services/account.service";
import { IoIosNotifications, IoMdNotificationsOff } from 'react-icons/io';
import ProfileMenu from "./MenuProfilHeader";
import {NotifyInter} from "../components/interfaces"
import { Colors } from "./Colors";
import PopupNotifUser from "./popup/NotifyUser";

interface IProps {
   notify: NotifyInter;
   setNotify: Dispatch<any>;
   colorHome:string;
   colorGame:string;
   colorLeadBoard:string;
   colorChat:string;
}

const Header:FunctionComponent<IProps> = (props:IProps)=> {
    const [notif, setNotif] = useState(true);
    const profileImg = accountService.getUrlImg();
    const [notifMenu, setNotifMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [active, setActive] = useState("UnActiveMenu");
    const handleScroll = useCallback(() => {
        setActive("UnActiveMenu");
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
    }, [handleScroll])

    const navMenu = () => {
        if (active === "ActiveMenu") {
            setActive("UnActiveMenu");
        } else setActive("ActiveMenu");
    }
    const handleMenuProfil = () => {
        if (profileMenu === true){
            setProfileMenu(false);
        }else if (profileMenu === false){
            setProfileMenu(true);
            setNotifMenu(false);
        }
    }
    const handleMenuNotif = () => {
        if (notifMenu === true){
            setNotifMenu(false);
        }else if (notifMenu === false){
            setNotifMenu(true);
            setProfileMenu(false);
        }
    }
	return (
        <StyledHeader>
            <StyleMenusHeader className={active}>
                <StyleMenuHeader colortext={props.colorHome} text={"Home"} to='/'>Home</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorGame}text={"Game"}to="/game">Game</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorLeadBoard}text={"LeaderBoard"} to='/leaderboard'>LeaderBoard</StyleMenuHeader>
                <StyleMenuHeader colortext={props.colorChat} text={"Chat"}to='/chat'>Chat</StyleMenuHeader>
                <StyleMenuHeaderNotity colorIcon={notif ? Colors.NotifActive : Colors.NotifUnactive}>
                    {notif ? <IoIosNotifications size={"22px"} onClick={handleMenuNotif}/> : <IoMdNotificationsOff size={"22px"}/>}
                </StyleMenuHeaderNotity>
                <StyleMenuHeaderProfil onClick={handleMenuProfil} profil={profileImg}/>        
                {profileMenu ? <ProfileMenu notify={props.notify} setNotify={props.setNotify}/> : <></>}
                {notifMenu ? <PopupNotifUser notify={props.notify} setNotify={props.setNotify} setNotif={setNotif}/> : <></>}
                </StyleMenusHeader>
            <StyleNavToggler onClick={navMenu} className={active}>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
            </StyleNavToggler>
        </StyledHeader>
	)
}

export default Header;


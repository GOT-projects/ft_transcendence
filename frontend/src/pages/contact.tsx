import { StyledChatPrive, StyledChatSep,
	StyledChatSwith, StyledContact, StyledContaite,
	StyledChatSwithTile, StyledSettingChan } from '../components/Styles/StyleChat';
import React, {Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import {Colors} from "../components/Colors"
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { SocketContext, SocketContextGame } from '../socket/socketPovider';
import { emitSocket } from '../socket/socketEmit';
import { GOT } from '../shared/types';

import { accountService } from '../services/account.service';
import { onSocket } from '../socket/socketOn';
import { offSocket } from '../socket/socketOff';
import { HiArrowCircleRight } from 'react-icons/hi';
import { FcInvite } from 'react-icons/fc';
import { AiFillSetting } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { emitGame } from '../socket/socketEmitGame';

const BackgroundAnimate = React.lazy(() => import("../components/BackGroundAnimate"))
const MenuChat = React.lazy(() => import('../components/chat/Menu'))
const PopupOptionInvite = React.lazy(() => import('../components/chat/Option/ChanInvite'))
const PopupOptionLeave = React.lazy(() => import('../components/chat/Option/ChanLeave'))
const PopupOptionBlock = React.lazy(() => import('../components/chat/Option/ChanBlock'))
const PopupOptionStatusAdmin = React.lazy(() => import('../components/chat/Option/StatusAdmin'))
const Footer = React.lazy(() => import("../components/Footer"))
const Header = React.lazy(() => import("../components/Header"))
const ProfilView = React.lazy(() => import('../components/popup/ProfilView'))
const PriveMsg = React.lazy(() => import('../components/chat/PrivMsg'))
const PriveUserMenu = React.lazy(() => import('../components/chat/PrivUsers'))
const PopupAddChannel = React.lazy(() => import('../components/chat/AddChannel'))
const PopupOptionAddUser = React.lazy(() => import('../components/chat/Option/AddUser'))
const PopupOptionAddChannel = React.lazy(() => import('../components/chat/Option/AddChannel'))
const PopupOptionJoinChannel = React.lazy(() => import('../components/chat/Option/JoinChannel'))
const PopupOptionExloreChat = React.lazy(() => import('../components/chat/Option/ExploreChan'))
const PopupOptionPrivateChan = React.lazy(() => import('../components/chat/Option/AddChannelPriv'))
const ChannelMsg  = React.lazy(() => import('../components/chat/ChannelMsg'))
const ChanUserMenu = React.lazy(() => import('../components/chat/ChanUser'))
const PopupChannelSetting = React.lazy(() => import('../components/chat/Option/SettingChan'))

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Chat:FunctionComponent<IProps> = (props:IProps)=> {
	const socket = useContext(SocketContext);
	const socketGame = useContext(SocketContextGame);
	const navigate = useNavigate();
	const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	const [active, setActive] = useState("UnActiveMenu");
	const [login, setLogin] = useState<string>("");

	const [add, setAdd] =  useState("");
	const [invite, setInvite] =  useState(false);
	const [setting, setSetting] =  useState(false);
	const [settingInvite, setSettingInvite] =  useState(false);
	const [settingBlock, setSettingBlock] =  useState(false);
	const [settingAdmin, setSettingAdmin] =  useState(false);
	const [chatSwitch, setChatSwitch] = useState<string>('');
	const [histo, setHisto] = useState<GOT.HistoryParties>();
	const [popuProfil, setPopupProfil] = useState(false);

	const [usersList, setUsersList] = useState<GOT.User[]>();
	const [selectUser, setSelectUser] = useState<GOT.User>();
	const [friends, setFriends] = useState<GOT.User[]>();
	const [lstFriends] = useState<GOT.Friend[]>()

	const [channelIn, setChannelIn] = useState<GOT.Channel[]>();

	const codeParam: Map<string, string> = accountService.getParamsPriv();

	useEffect(() => {
		emitGame.emit_where_am_I(socketGame,"no_where");
	}, [socketGame])

	useEffect(() => {
		onSocket.profil_login(socket, setHisto);
		return () => {
			offSocket.profil_login(socket);
		}
	}, [histo, socket]);

	useEffect(() => {
		(async () => {
			await onSocket.client_privmsg_users(socket, setFriends);
		})();
	},[socket, friends, setFriends])

	useEffect(() => {
		onSocket.client_channels_in(socket, setChannelIn)
		return () => {
			offSocket.client_channelIn(socket);
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
	}, [socket])

	useEffect(() => {
		emitSocket.emitUsers(socket);
	}, [socket])

	useEffect(() => {
		emitSocket.emitChannelsIn(socket);
	}, [socket])

	useEffect(() =>{
		if (codeParam.get("code") === "Private" && codeParam.get("name")){
			const name = codeParam.get("name");
			const check = friends?.filter((friend) => friend.login === name)
			if (check && check?.length !== 0){
				const user = friends?.filter((user) => user.login === name);
				if (user){
					const tmp:GOT.User = user[0];
					if (selectUser !== tmp){
						setSelectUser(tmp);
						setAdd("");
						emitSocket.emitPrivmsg(socket, check[0].login);
					}
				}
				setChatSwitch("Private");
				setAdd("");
			}
		}else if(codeParam.get("code") === "Private"){
				setAdd("");
				setChatSwitch("Private");
		}

		const tmp = codeParam.get("code");
		if (tmp){
			setAdd(tmp);
			if (codeParam.get("code") === "Channel" && codeParam.get("name") && codeParam.get("setting") === undefined){
				const name = codeParam.get("name");
				if (name)
					setChatSwitch(name);
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "Menu"){
				setSetting(true);
				setSettingInvite(false);
				setSettingAdmin(false);
				setSettingBlock(false);
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "Change"){
				setAdd("addChannel");
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "Invite"){
				setSettingInvite(true);
				setSetting(false);
				setSettingAdmin(false);
				setSettingBlock(false);
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "Block"){
				setSettingBlock(true);
				setSettingInvite(false);
				setSettingAdmin(false);
				setSetting(false);
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "Admin"){
				setSettingAdmin(true);
				setSettingInvite(false);
				setSettingBlock(false);
				setSetting(false);
			}else if(codeParam.get("code") === "Channel" && codeParam.get("name") === chatSwitch && codeParam.get("setting") === "false"){
				setSettingInvite(false);
				setSettingBlock(false);
				setSettingAdmin(false);
				setSetting(false);
				setAdd("");
			}
            if(codeParam.get("setting") === undefined){
				setSettingInvite(false);
				setSetting(false);
            }
		}
		else
			setAdd("");
	}, [codeParam, add, settingInvite, settingBlock, setting, settingAdmin, chatSwitch, friends/*, handleSelectFriend*/, socket, selectUser])

	return (
		<React.Fragment>
            <React.Suspense fallback='loading...'>
			    <BackgroundAnimate name="contact"/>
            </React.Suspense>
            <React.Suspense fallback='loading...'>
			    <Header colorHome={Colors.MenuDisable}
					colorGame={Colors.MenuDisable}
					colorLeadBoard={Colors.MenuDisable}
					colorChat={Colors.MenuActive}
					notify={notify}
					setNotify={setNotify}
					profil={props.profil}
					setProfil={props.setProfil}
			 />
            </React.Suspense>

			<StyledContaite>
            <React.Suspense fallback='loading...'>
				<MenuChat  friends={friends} profil={props.profil} setFriends={setFriends}
						   setProfil={props.setProfil}
						   chatSwitch={chatSwitch} setChatSwitch={setChatSwitch}
						   active={active} setActive={setActive} channelIn={channelIn}
						   listUser={usersList} add={add} setAdd={setAdd}/>
            </React.Suspense>
				<StyledContact className={active}>
					<StyledChatSwith>
						<StyledChatSwithTile>{chatSwitch}</StyledChatSwithTile>
					</StyledChatSwith>
					<StyledChatSep/>
					<StyledChatPrive className={add}>
					{add === "Private" ? 
                        <React.Suspense fallback='loading...'>
                        <PriveUserMenu friends={friends}
											setFriends={setFriends} selectUser={selectUser}
											setActive={setActive} profil={props.profil}
											setSelectUser={setSelectUser} userFriend={lstFriends}
											setLogin={setLogin}
											setPopupProfil={setPopupProfil}
											popuProfil={popuProfil}/> 
                        </React.Suspense>
                                            : <></>}
					{add === "Channel" ? 
                        <React.Suspense fallback='loading...'>
                        <ChanUserMenu profil={props.profil}
											setPopupProfil={setPopupProfil} chanName={chatSwitch}
											popuProfil={popuProfil} setActive={setActive}
											setLogin={setLogin}/> 
                        </React.Suspense>
                                            : <></>}
					</StyledChatPrive>
					{add === "Channel"  && codeParam.get("name") !== undefined ? 
                        <StyledSettingChan>
						<AiFillSetting style={{marginLeft:"10px"}} size={30} color={Colors.grey} title="Channel Setting"
											onClick={() => {
											navigate(`/chat?code=Channel&name=${chatSwitch}&Setting=Menu`)
											}}/>
						<FcInvite size={30} title="Invite people tot channel"
											onClick={() => {
											    navigate(`/chat?code=Channel&name=${chatSwitch}&Setting=Invite`)
                                                }}/>
						<HiArrowCircleRight size={30} color={"red"} title="Leave Channel"
											onClick={() => {
												emitSocket.emitLeaveChan(socket, chatSwitch, props.profil?.userInfos.login)
												setChatSwitch("")
												navigate("/chat")}}/>
					</StyledSettingChan> 
                    : <></>}
				</StyledContact>

				{add === "Private" ? 
                                <React.Suspense fallback='loading...'>
                                    <PriveMsg active={active} profil={props.profil}
											setProfil={props.setProfil}
											userSelect={selectUser}/> 
                                </React.Suspense>
                                : <></>}

				{add === "Channel" && codeParam.get("name") !== undefined ? 
                        <React.Suspense fallback='loading...'>
                            <ChannelMsg active={active} profil={props.profil}
											setProfil={props.setProfil}
											chanName={chatSwitch}/> 
                        </React.Suspense>
                                            : <></>}
			</StyledContaite>

			{add === "add" ? 
                        <React.Suspense fallback='loading...'>
                            <PopupAddChannel friends={friends} setFriends={setFriends}
											profil={props.profil} setProfil={props.setProfil}
											setAction={setAdd} listUser={usersList}/> 
                        </React.Suspense>
                                            : <></>}

			{add === "addUser" ? 
                        <React.Suspense fallback='loading...'>
                            <PopupOptionAddUser profil={props.profil} friends={friends}
										listUser={usersList} setAdd={setAdd}
										setFriends={setFriends} /> 
                        </React.Suspense>
                                        : <></>}
			{invite ? 
                        <React.Suspense fallback='loading...'>
                            <PopupOptionInvite profil={props.profil} friends={friends}
										listUser={usersList} setAdd={setAdd}
										setInvite={setInvite}
										setFriends={setFriends} chanName={chatSwitch}/> 
                        </React.Suspense>
                                        : <></>}

			{setting ? 
                        <React.Suspense fallback='loading...'>
                            <PopupChannelSetting profil={props.profil} listUser={usersList}
										setProfil={props.setProfil} setAction={setAdd}
										setFriends={setFriends} friends={friends}
										chanName={chatSwitch} setSetting={setSetting}/>
                        </React.Suspense>
                                        : <></>}
			{settingInvite ? 
                        <React.Suspense fallback='loading...'>
                            <PopupOptionLeave profil={props.profil} friends={friends}
										listUser={usersList} setAdd={setAdd}
										setInvite={setSettingInvite}
										setFriends={setFriends} chanName={chatSwitch}/> 
                        </React.Suspense>
                                        : <></>}
			{settingAdmin ? 
                        <React.Suspense fallback='loading...'>
                            <PopupOptionStatusAdmin profil={props.profil} friends={friends}
										listUser={usersList} setAdd={setAdd}
										setInvite={setSettingAdmin}
										setFriends={setFriends} chanName={chatSwitch}/> 
                        </React.Suspense>
                                        : <></>}
			{settingBlock ? 
                    <React.Suspense fallback='loading...'>
                        <PopupOptionBlock profil={props.profil} friends={friends}
										listUser={usersList} setAdd={setAdd}
										setInvite={setSettingBlock}
										setFriends={setFriends} chanName={chatSwitch}/> 
                        </React.Suspense>
                                        : <></>}
			{add === "addChannel" ? 
                    <React.Suspense fallback='loading...'>
                        <PopupOptionAddChannel /> 
                    </React.Suspense>
                    : <></>}

			{add === "joinChannel" ? 
                    <React.Suspense fallback='loading...'>
                        <PopupOptionJoinChannel /> 
                    </React.Suspense>
                    : <></>}

			{add === "explore" ? 
                    <React.Suspense fallback='loading...'>
                        <PopupOptionExloreChat channelIn={channelIn}/> 
                    </React.Suspense>
                    : <></>}

			{add === "privateChan" ? 
                    <React.Suspense fallback='loading...'>
                        <PopupOptionPrivateChan />
                    </React.Suspense>
            : <></>}


			{popuProfil ? 
             <React.Suspense fallback='loading...'>
                 <ProfilView login={login} setPopupProfil={setPopupProfil} profil={props.profil}/> 
             </React.Suspense>
            : <> </>}
			    <Notification notify={notify} setNotify={setNotify}/>
             <React.Suspense fallback='loading...'>
		        <Footer/>
             </React.Suspense>
		</React.Fragment>
	)
}
export default Chat;

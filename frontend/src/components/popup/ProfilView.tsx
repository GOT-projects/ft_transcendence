import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../shared/types";
import { StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryUserButton, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteText, StyledContaiteView } from "../Styles/StyleViewProfil";
import { FaWindowClose } from 'react-icons/fa';
import { Colors } from "../Colors";
import { v4 as uuid } from 'uuid';
import { SocketContext } from "../../socket/socketPovider";
import { emitSocket } from "../../socket/socketEmit";
import { onSocket } from "../../socket/socketOn";
import { GiRetroController } from "react-icons/gi";
import { MdOutlineViewInAr } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { StatusProfile } from "./FriendLst";
import { StyledChatSettingButton } from "../Styles/StyleChat";
import { AiOutlineUserAdd } from "react-icons/ai";


interface IProps {
	setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
	profil: GOT.Profile | undefined;
	login: string;
}

const ProfilView:FunctionComponent<IProps> = (props:IProps) =>{
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const [profil, setProfil] = useState<GOT.HistoryParties>();
	const handleClose = ( ) => {
		props.setPopupProfil(false);
	}

	useEffect(() => {
		onSocket.profil_login(socket, setProfil);
	}, [socket]);

	useEffect(() => {
		emitSocket.emitProfilHisto(socket, props.login);
	}, [socket, props.login]);

	const handleInviteGame = ()=>{
		navigate(`/game?code=waiting&id=${profil?.userInfos.login}`)
	}

	const handleSpect = () => {
		navigate(`/game?code=spectator&id=${profil?.inGame}`)
	}
	const handleStatus = (login: string | undefined)=>{
		if (login === undefined)
			return ""
		const tmp = props.profil?.friends.filter((f) => f.login === login)
		if (tmp?.length !== 0 && tmp !== undefined){
			return tmp[0].status;
		}
		return ""
	}
	const handleAddFriend = (login:string | undefined) => {
		if (login !== undefined){
			emitSocket.emitDemandFriend(socket, login);
		}
	}

	const handleCheckFriend = () => {
		if (props.profil?.userInfos.login === profil?.userInfos.login){
			return false;
		}
		const tmp = props.profil?.friends.filter((l) => l.login === profil?.userInfos.login)
		if (tmp !== undefined && tmp.length !== 0) {
			return false;
		}
		return true;
	}

	return(
		<StyledContaiteView>
			<StyledContaiteClose>
					<FaWindowClose size={30} color={Colors.dark1} onClick={handleClose}/>
			</StyledContaiteClose>
			<StyledContaiteProfil>
				<StatusProfile size={"50px"} img={profil?.userInfos.urlImg} username={profil?.userInfos.login} status={handleStatus(profil?.userInfos.login)} page="viewProfil"/>
				<StyledContaiteText className="title" size={"18px"}>{profil?.userInfos.login}</StyledContaiteText>
				<StyledContaiteHistoryUserButton>
					<GiRetroController size={30} color={Colors.primary} title={"invite game"} onClick={handleInviteGame}/>
					{profil?.inGame !== undefined ?
					<MdOutlineViewInAr size={30} color={Colors.primary} title={"View game"} onClick={handleSpect}/>:<></>}
					{handleCheckFriend() ?
					<StyledChatSettingButton onClick={() => {handleAddFriend(profil?.userInfos.login)}}>
						<AiOutlineUserAdd className='setting' size={30} color={Colors.ChatMenuButtonText}/>
					</StyledChatSettingButton> : <></>}

				</StyledContaiteHistoryUserButton>
			</StyledContaiteProfil>
			<StyledContaiteRank>
				<StyledContaiteText size={"12px"}>{`rank ${profil?.stat.rank} victory ${profil?.stat.victory} lose ${profil?.stat.defeat}`}</StyledContaiteText>
			</StyledContaiteRank>
			<StyledContaiteHistory>
				<StyledContaiteHistorytile>
					<StyledContaiteText size={"16px"}>HISTORIC</StyledContaiteText>
				</StyledContaiteHistorytile>
					{
						profil?.parties.map( (party: GOT.Party) => (

							<StyledContaiteHistorylst key={uuid()}>
								<StyledContaiteHistoryUser>
									<StyledContaiteText className="title" size={"12px"}>{party.user1.login}</StyledContaiteText>
								</StyledContaiteHistoryUser>
								<StyledContaiteHistoryVs>
									<StyledContaiteText size={"12px"}>VS</StyledContaiteText>
								</StyledContaiteHistoryVs>
								<StyledContaiteHistoryUser>
									<StyledContaiteText className="title" size={"12px"}>{party.user2.login}</StyledContaiteText>
								</StyledContaiteHistoryUser>
								<StyledContaiteHistoryScore>
									<StyledContaiteText size={"10px"}>{party.points1}-{party.points2}</StyledContaiteText>
								</StyledContaiteHistoryScore>
							</StyledContaiteHistorylst>
						))
					}
			</StyledContaiteHistory>
		</StyledContaiteView>
	)
}

export default ProfilView;

import { Dispatch, FunctionComponent } from "react";
import { FaWindowClose } from "react-icons/fa";
import { Colors } from "../../Colors";
import {StyledContaiteClose, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP } from "../../Styles/StyleViewProfil"; 
import { useNavigate } from "react-router-dom";
import { GOT } from "../../../shared/types";


interface IProps {
	profil: GOT.Profile | undefined;
	listUser:GOT.User[] | undefined;
	setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
	setAction:Dispatch<React.SetStateAction<string>>;
	setSetting:Dispatch<React.SetStateAction<boolean>>;
	setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
	friends:GOT.User[] | undefined;
	chanName: string;
}


const PopupChannelSetting:FunctionComponent<IProps> = (props: IProps) =>{
	const navigate = useNavigate();
	const handleClose = () => {
		props.setSetting(false);
		navigate(`/chat?code=Channel&name=${props.chanName}`);
	}

	const handleSettingInvite = () => {
		props.setSetting(false);
		navigate(`/chat?code=Channel&name=${props.chanName}&Setting=Invite`);
	}

	const handleSettingChannel = () => {
		props.setSetting(false);
		navigate(`/chat?code=Channel&name=${props.chanName}&Setting=Change`);
	}

	const handleSettingBlock = () => {
		props.setSetting(false);
		navigate(`/chat?code=Channel&name=${props.chanName}&Setting=Block`);
	}
	const handleSettingAdmin = () => {
		props.setSetting(false);
		navigate(`/chat?code=Channel&name=${props.chanName}&Setting=Admin`);
	}

	return (
		<StyledContaiteViewAddChan>
				<StyledContaiteClose onClick={handleClose}>
						<FaWindowClose size={30} color={Colors.dark1}/>
				</StyledContaiteClose>
				<StyledContaiteViewAddP className="addTitle">Setting Channel</StyledContaiteViewAddP>
				<StyledContaiteViewAddOption onClick={() => {handleSettingChannel()}}>
					<StyledContaiteViewAddP >Status Channel</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
				<StyledContaiteViewAddOption onClick={() => {handleSettingAdmin()}}>
					<StyledContaiteViewAddP>User status</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
				<StyledContaiteViewAddOption onClick={() => {handleSettingBlock()}}>
					<StyledContaiteViewAddP>UnBlock Users</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
				<StyledContaiteViewAddOption onClick={() => {handleSettingInvite()}}>
					<StyledContaiteViewAddP>Leave</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
		</StyledContaiteViewAddChan>
	)
}

export default PopupChannelSetting;

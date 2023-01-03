import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, 
		StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, 
		StyledContaiteViewAddChan, StyledContaiteViewAddP, StyledEmptyDiv } from "../../Styles/StyleViewProfil";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { onSocket } from "../../../socket/socketOn";
import { v4 as uuid } from "uuid";
import { offSocket } from "../../../socket/socketOff";
import { accountService } from "../../../services/account.service";
import { useNavigate } from "react-router-dom";

interface IProps {
	listUser:GOT.User[] | undefined;
	setAdd:Dispatch<React.SetStateAction<string>> | undefined;
	friends:GOT.User[] | undefined;
	setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
	profil: GOT.Profile | undefined;
	setInvite:Dispatch<React.SetStateAction<boolean>>;
	chanName: string;
}

const PopupOptionInvite:FunctionComponent<IProps> = (props: IProps) =>{
	const socket = useContext(SocketContext)
	const [selectUser, setSelectUser] = useState<GOT.User[]>([]);
	const [userList, setUserlist] = useState<GOT.ChannelUsers>();
	const codeParam: Map<string, string> = accountService.getParamsPriv();
	const navigate = useNavigate();

	const handleClose = () => {
		props.setInvite(false);
		navigate(`/chat?code=Channel&name=${props.chanName}`)
	}

	useEffect(() => {
        if (codeParam.get("setting") === "Invite"){
		    onSocket.client_chanmsg_users_not_ban(socket, setUserlist);
        }
		return () => {
			offSocket.client_chanmsg_users_not_ban(socket);
		}
	}, [socket, setUserlist, userList])

	useEffect(() => {
        if (codeParam.get("code") === "Channel" && codeParam.get("name") !== undefined ){
		    emitSocket.emitChanUserNotBan(socket, props.chanName);
        }
	}, [socket, props.chanName])

	const handleSelect = (user: GOT.User) => {
		const find = selectUser.find((select) => select.login === user.login)
		if (find){
			const tmp = selectUser.filter((filter) => filter.login !== user.login);
			if (tmp)
				setSelectUser(tmp);
		}else{
			setSelectUser((prev) => [...prev, user]);
		}
	}	

	const handleSend = () => {
		selectUser.map((user) => {
			emitSocket.emitInviteSomebody(socket, props.chanName, user.login);
			return true;
		})
		props.setInvite(false);
	}

	const handleListUser = (login : string) => {
		const tmp = userList?.users.filter((user) => user.login === login)
		if (tmp && tmp.length !== 0){
			return false
		}
		return true
	}

	return (
		<StyledContaiteViewAddChan>
				<StyledContaiteClose onClick={handleClose} className="invite">
						<FaWindowClose size={30} color={Colors.dark1}/>
						<StyledContaiteViewAddP className="addUserTitle">
								Invite to channel
						</StyledContaiteViewAddP>
				</StyledContaiteClose>
				<StyledContaiteAddUser>
					<StyledContaiteDivUser key={uuid()}>
						{props.listUser?.map((user) => (
								handleListUser(user.login) ? 
								<StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user)}} 
									color={selectUser.find((select) => select.login === user.login) ? 
									Colors.grey : Colors.Bg2faIn}>
									<StyledContaitePUser key={uuid()} >{user.login}</StyledContaitePUser>
								</StyledContaiteDivPUser> : <StyledEmptyDiv key={uuid()}></StyledEmptyDiv>
						))}
					</StyledContaiteDivUser>
				</StyledContaiteAddUser>
				<StyledContaiteReturn className="addUser">
					<StyledContaiteReturnDiv onClick={handleSend}>
						<p>Send invitation</p>
					</StyledContaiteReturnDiv>
				</StyledContaiteReturn>
		</StyledContaiteViewAddChan>
	)
}

export default PopupOptionInvite;

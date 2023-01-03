import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { GOT } from "../../../shared/types";
import { StyledContaiteAddUser, StyledContaiteClose, StyledContaiteDivPUser, StyledContaiteDivUser, StyledContaitePUser, StyledContaiteReturn, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddP, StyledEmptyDiv } from "../../Styles/StyleViewProfil";
import { Colors } from "../../Colors";
import { emitSocket } from "../../../socket/socketEmit";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

interface IProps {
	listUser:GOT.User[] | undefined;
	setAdd:Dispatch<React.SetStateAction<string>> | undefined;
	friends:GOT.User[] | undefined;
	setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
	profil: GOT.Profile | undefined;
}
const PopupOptionAddUser:FunctionComponent<IProps> = (props: IProps) =>{
	const navigate = useNavigate();
	const socket = useContext(SocketContext)
	//const [input, setInput] = useState("");
	const [selectUser, setSelectUser] = useState<GOT.User[]>([]);

	const handleClose = () => {
			navigate("/chat");
	}

	const handleSelect = (user: GOT.User) => {
		const find = selectUser.find((select) => select.login === user.login)
		if (find !== undefined){
			setSelectUser((select) => select.filter((use) => use.login !== user.login))
		}else if (setSelectUser){
			const tmp:GOT.User[] = [];
			tmp.push(user);
			if (setSelectUser)
				setSelectUser(tmp);
		}
	}	

	const handleReturn = () => {
		if (props.setAdd)
			navigate("/chat?code=add")
	}

	const handleSend = async () => {
		selectUser.map( async (select ) => {
			await emitSocket.emitSendPrivmsg(socket, select.login, "👋");
			if (props.setFriends){
				if (props.friends)
					props.setFriends([...props.friends, select]);
				}else{
					const tmp:GOT.User[] = [];
					tmp.push(select);
					setSelectUser(tmp)
				}
			navigate(`/chat?code=Private`);
		})
		navigate(`/chat?`);
	}

	const handleListUser = (login : string) => {
		if (login === props.profil?.userInfos.login)
			return (false);
		const tmp1 =props.friends?.filter((user) => user.login === login);
		if (tmp1 !== undefined && tmp1.length !== 0)
			return (false);
		return (true);
	}

	return (
		<StyledContaiteViewAddChan>
				<StyledContaiteClose onClick={handleClose}>
						<FaWindowClose size={30} color={Colors.dark1}/>
						<StyledContaiteViewAddP className="addUserTitle">Add user for message</StyledContaiteViewAddP>
				</StyledContaiteClose>
				<StyledContaiteAddUser>
					<StyledContaiteDivUser>
						{props.listUser?.map((user) => (
								handleListUser(user.login) ? 
								<StyledContaiteDivPUser key={uuid()} onClick={() => {handleSelect(user)}} 
									color={selectUser.find((select) => select.login === user.login) ? Colors.grey : Colors.Bg2faIn}>
									<StyledContaitePUser key={uuid()} >{user.login}</StyledContaitePUser>
								</StyledContaiteDivPUser> : <StyledEmptyDiv key={uuid()}/>
						))}
					</StyledContaiteDivUser>
				</StyledContaiteAddUser>
				<StyledContaiteReturn className="addUser">
					<StyledContaiteReturnDiv onClick={handleReturn}>
						<p>return</p>
					</StyledContaiteReturnDiv>
					<StyledContaiteReturnDiv onClick={handleSend}>
						<p>add</p>
					</StyledContaiteReturnDiv>
				</StyledContaiteReturn>
		</StyledContaiteViewAddChan>
	)
}

export default PopupOptionAddUser;

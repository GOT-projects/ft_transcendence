import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { GOT } from "../../shared/types";
import { emitSocket } from "../../socket/socketEmit";
import { SocketContext } from "../../socket/socketPovider";
import { StyleNavToggler, StyleNavTogglerIcon } from "../Styles/StyledHeader";
import { StyledChanDiv, StyledChanPadd, StyledChanSep, StyledContaiteChannel, StyledContaiteMenu, StyledContaiteMenuSelector, StyledSelector } from "../Styles/StyleViewProfil";
import { TiMessages} from 'react-icons/ti';
import { Colors } from "../Colors";
import { accountService } from "../../services/account.service";


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil:Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
   chatSwitch: string;
   setChatSwitch:Dispatch<React.SetStateAction<string>> | undefined;
   listUser:GOT.User[] | undefined;
   setFriends:Dispatch<React.SetStateAction<GOT.User[] | undefined>> | undefined;
   setAdd:Dispatch<React.SetStateAction<string>>;
   add:string;
   friends:GOT.User[] | undefined;
   channelIn:GOT.Channel[] | undefined;
   active: string;
   setActive:Dispatch<React.SetStateAction<string>> | undefined;
}


const MenuChat:FunctionComponent<IProps> = (props: IProps) =>{
	const navigate = useNavigate();
	const socket = useContext(SocketContext);
	const codeParam: Map<string, string> = accountService.getParamsPriv();
	const [code, setCode] = useState<string>("");
	const [nameChan, setNameChan] = useState<string>();

	useEffect(() => {
		const name = codeParam.get("name")
		const codeTmp = codeParam.get("code")
        if (codeTmp === undefined){
			setNameChan("")
			setCode("");
            console.log("fjksdjkfjksdjfjksdjfsdk", code, "jfksdj")
        }else if( code !== undefined  && name !== undefined && code === "Channel"){
			setNameChan(name)
		}else if (codeTmp !== undefined){
			setCode(codeTmp);
			setNameChan("")
		}else{
			setNameChan("")
			setCode("");
		}
	}, [codeParam, code])

	const handlePriveMsg = (name:string) => {
		if (props.setChatSwitch){
			emitSocket.emitProfil(socket);
			props.setChatSwitch(name);
			navigate("/chat?code=Private")
		}
	}

	const handleChan = (name:string) => {
		if (props.setChatSwitch){
			emitSocket.emitProfil(socket);
            if (props.setActive){
			    props.setActive("UnActiveMenu");
            }
			props.setChatSwitch(name);
			navigate(`/chat?code=Channel&name=${name}`)
		}
	}
	const navMenu = () => {
		if (props.active === "ActiveMenu" && props.setActive) {
			props.setActive("UnActiveMenu");
		} else if (props.setActive){
			props.setActive("ActiveMenu");
		}
	}

	const handleAddChannel = () => {
		props.setAdd("add");
		if (props.setActive)
			props.setActive("UnActiveMenu");
		navigate("/chat?code=add")
	}

	const handleChanName = (login:string) => {
		if (login === nameChan){
			return true;
		}
		return false;
	}
	return (
		<StyledContaiteMenu className={code !== "" ? "select" : ""}>
			<StyleNavToggler onClick={navMenu} className={props.active}>
				<StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
				<StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
				<StyleNavTogglerIcon className={props.active}></StyleNavTogglerIcon>
			</StyleNavToggler>
		<StyledContaiteMenu className={props.active}>
			<StyledContaiteMenuSelector className={code === "Private" ? "select" : "notSelect"}>
				<StyledSelector></StyledSelector>
				<StyledChanDiv className={code === "Private" ? "select" : "notSelect"} onClick={() => {handlePriveMsg("private")}}>
					<TiMessages size={30} color={Colors.primary}/>
				</StyledChanDiv>
			</StyledContaiteMenuSelector>
			<StyledChanSep/>
			<StyledContaiteChannel>
				<StyledChanDiv className={code === "add" ? "select" : "notSelect"} onClick={() => {handleAddChannel()}}>
					<StyledChanPadd >+</StyledChanPadd>
				</StyledChanDiv>
				{props.channelIn?.map((chan) => (
					<StyledContaiteMenuSelector key={uuid()} className={handleChanName(chan.name) ? "select" : "notSelect"}>
					<StyledSelector></StyledSelector>
					<StyledChanDiv key={uuid()} className={handleChanName(chan.name) ? "select" : "notSelect"} onClick={() => {handleChan(chan.name)}}>
						<p>{chan.name.substring(0, 4)}</p>
					</StyledChanDiv>
					</StyledContaiteMenuSelector>
				))}
			</StyledContaiteChannel>
		</StyledContaiteMenu>
		</StyledContaiteMenu>
	)
}
export default MenuChat;

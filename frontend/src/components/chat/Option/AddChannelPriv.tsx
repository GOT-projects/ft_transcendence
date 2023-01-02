import { FunctionComponent } from "react";
import { FaWindowClose } from "react-icons/fa";
import { StyledContaiteClose, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP, StyledContaiteViewoptionChan } from "../../Styles/StyleViewProfil";
import { motion } from "framer-motion";
import { Colors } from "../../Colors";
import { useNavigate } from "react-router-dom";

interface IProps {
}

const PopupOptionPrivateChan:FunctionComponent<IProps> = (props: IProps) =>{
	//const [inputName, setInputName] = useState("");
	//const [inputPwd, setInputPwd] = useState("");
	const navigate = useNavigate();

	const handleClose = () => {
		navigate("/chat?code=Prvi")
		 
	}

	const handleReturn = () => {
		navigate("/chat?code=joinChannel")
	}

	const handleAdd = (name: string) => {
	   navigate(`/chat?code=${name}`)
	}
	return (
		<StyledContaiteViewAddChan>
			<StyledContaiteClose className="joinChan" onClick={handleClose}>
					<FaWindowClose size={30} color={Colors.dark1}/>
					<StyledContaiteViewAddP className="addUserTitle">Channel options</StyledContaiteViewAddP>
			</StyledContaiteClose>
			<StyledContaiteViewoptionChan>
				<StyledContaiteViewAddOption onClick={() => {handleAdd("explore")}}>
					<StyledContaiteViewAddP>Channel name:</StyledContaiteViewAddP>
					<input/>
				</StyledContaiteViewAddOption>
				<StyledContaiteViewAddOption onClick={() => {handleAdd("privateChan")}}>
					<StyledContaiteViewAddP>Password:</StyledContaiteViewAddP>
					<input/>
				</StyledContaiteViewAddOption>
			</StyledContaiteViewoptionChan> 
				<StyledContaiteReturnDiv className="joinChan" onClick={handleReturn}>
					<p>return</p>
				</StyledContaiteReturnDiv>
		</StyledContaiteViewAddChan>
	)
}

export default PopupOptionPrivateChan;

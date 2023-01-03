import { FunctionComponent } from "react";
import { FaWindowClose } from "react-icons/fa";
import { StyledContaiteClose, StyledContaiteReturnDiv, StyledContaiteViewAddChan, StyledContaiteViewAddOption, StyledContaiteViewAddP, StyledContaiteViewoptionChan } from "../../Styles/StyleViewProfil";
import { Colors } from "../../Colors";
import { useNavigate } from "react-router-dom";

const PopupOptionJoinChannel = () =>{
	const navigate = useNavigate();

	const handleClose = () => {
		navigate("/chat?code=Prvi")
	}

	const handleReturn = () => {
		navigate("/chat?code=add")
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
					<StyledContaiteViewAddP>Explore channel</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
				<StyledContaiteViewAddOption onClick={() => {handleAdd("privateChan")}}>
					<StyledContaiteViewAddP>Join channel private</StyledContaiteViewAddP>
					<StyledContaiteViewAddP>{">"}</StyledContaiteViewAddP>
				</StyledContaiteViewAddOption>
			</StyledContaiteViewoptionChan> 
				<StyledContaiteReturnDiv className="joinChan" onClick={handleReturn}>
					<p>return</p>
				</StyledContaiteReturnDiv>
		</StyledContaiteViewAddChan>
	)
}

export default PopupOptionJoinChannel;

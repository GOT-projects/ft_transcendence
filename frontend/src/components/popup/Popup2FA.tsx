import { Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api/post";
import { accountService } from "../../services/account.service";
import { StyledWaiting2FAForm, StyledWaiting2FAInput, StyledWaitingButton, StyledWaitingContente2FA } from "../Styles/StylesLogin";


interface IProps {
	setNotify: Dispatch<any>;
 }

const Popup2FA = (props: IProps) => {
	const navigate = useNavigate();
	const handleInputEvent = (e: any) => {
		const t = e.currentTarget.nextSibling
		if (t && e.currentTarget.value){
			t.focus();
			t.value = "";
		}
	};
	const handleSubmit = (e:any) => {
		e.preventDefault();
		const code = e.target[0].value + e.target[1].value + e.target[2].value + e.target[3].value + e.target[4].value + e.target[5].value;
		const resp = apiPost.Post2FAAuth(code);
		resp.then((rep) => {
			if (rep.status === 200) {
				accountService.saveToken(rep.data.access_token);
				navigate("/game");
			}
			else{
				e.target[0].value = e.target[1].value = e.target[2].value = e.target[3].value = e.target[4].value = e.target[5].value = '';
				props.setNotify({isOpen: true, message: `Warning: invalid code`, type:'warning'});
			}
		}).catch((rep) => {
			e.target[0].value = e.target[1].value = e.target[2].value = e.target[3].value = e.target[4].value = e.target[5].value = '';
			props.setNotify({isOpen: true, message: `Warning: invalid code`, type:'warning'});
		})
		//send to server
	}

	return (
		<StyledWaitingContente2FA>
			<StyledWaiting2FAForm onSubmit={handleSubmit}>
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n1" onInput={(e) => {handleInputEvent(e)}} autoFocus/>
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n2" onInput={(e) => {handleInputEvent(e)}} />
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n3" onInput={(e) => {handleInputEvent(e)}} />
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n4" onInput={(e) => {handleInputEvent(e)}} />
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n5" onInput={(e) => {handleInputEvent(e)}} />
				<StyledWaiting2FAInput type="number" min="0" max="9" maxLength={1} placeholder=" " id="n6" onInput={(e) => {handleInputEvent(e)}} />
				<StyledWaitingButton type="submit">Send</StyledWaitingButton>
			</StyledWaiting2FAForm>
		</StyledWaitingContente2FA>
	)
}

export default Popup2FA;

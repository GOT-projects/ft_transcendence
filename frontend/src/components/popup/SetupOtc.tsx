import React, { Dispatch, FunctionComponent, useEffect, useState } from "react";
import { StyledContaite, StyledContaiteDescription, StyledContaiteDescriptionH1, StyledContaiteDescriptionH3, StyledContaiteDescriptionP, StyledContaiteQrcode } from "../Styles/StyleOtc";
import {apiPost} from "../../api/post"

interface IProps {
   setOtc: Dispatch<React.SetStateAction<boolean>>;
}
const SetupOtc:FunctionComponent<IProps> = (props: IProps) => {
    //todo request post get qrcode
    const [gcode, setGcode] = useState<string>();
    const [code, setCode] = useState<string>();
    const [inputOtc, setInputOtc] = useState<string>();
    useEffect(() => {
        try{
            const rep = apiPost.Post2FAGenerate();
            if (rep){
                rep.then((response:any) =>{
                    console.log(response)
                    setGcode(response.data.qrcode)
                    setCode(response.data.secret)
                })
            }

        }catch(e){
            console.log(e);
        }
    },[])

    const handleChange = (event: any) => {
        if (inputOtc === "" && event.target.value ==="\n")
            return;
		setInputOtc(event.target.value);
	}	
    const sendOtc = () => {
        try{
            const rep = apiPost.Post2FAActivate(inputOtc);
            if (rep){
                rep.then((response:any) =>{
                    console.log(response);
                })
            }
            setInputOtc('');
        }catch(e){
            console.log(e);
        }
	}	

    return (
        <StyledContaite
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: -100, opacity: 0}}>
        <StyledContaiteDescriptionH1>Setup Authenticator app</StyledContaiteDescriptionH1>
        <StyledContaiteDescription>
            <StyledContaiteDescriptionP>Use a phone app like: 1Password Authy LasPass Authenticator etc. to get 2FA codes when prompted during sign-in</StyledContaiteDescriptionP>
            <StyledContaiteDescriptionH3>Scan the QR code</StyledContaiteDescriptionH3>
            <StyledContaiteDescriptionH3>Entry this text code or scan the Qrcode</StyledContaiteDescriptionH3>
            <StyledContaiteDescriptionP>{ code }</StyledContaiteDescriptionP>
        </StyledContaiteDescription>
        <StyledContaiteQrcode>
            <img alt="qrcode to add 2fa" src={gcode} style={{width: "250px"}}/>
        </StyledContaiteQrcode>
            <StyledContaiteDescriptionP>Verify the code from the app</StyledContaiteDescriptionP>
            <input style={{margin: "10px"}} type="text" value={inputOtc} placeholder="OTC CODE" onChange={(e) => {handleChange(e)}}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey){
                                                                                        sendOtc();
                                                                                    }}}/>
        </StyledContaite>
    )

}

export default SetupOtc;

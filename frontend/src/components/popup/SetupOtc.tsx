import React, { Dispatch, FunctionComponent, useEffect, useState } from "react";
import { StyledContaite, StyledContaiteDescription, StyledContaiteDescriptionA, StyledContaiteDescriptionH1, StyledContaiteDescriptionH3, StyledContaiteDescriptionP, StyledContaiteQrcode } from "../Styles/StyleOtc";
import QRCode from "react-qr-code";
import {apiPost} from "../../api/post"

interface IProps {
   setOtc: Dispatch<React.SetStateAction<boolean>>;
}
const SetupOtc:FunctionComponent<IProps> = (props: IProps) => {
    //todo request post get qrcode
    const [gcode, setGcode] = useState<string>();
    useEffect(() => {
        const rep = apiPost.Post2FAGenerate();
        console.log(rep);
        
    })
    return (
        <StyledContaite
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: -100, opacity: 0}}>
        <StyledContaiteDescriptionH1>Setup Authenticator app</StyledContaiteDescriptionH1>
        <StyledContaiteDescription>
            <StyledContaiteDescriptionP>Use a phone app like: </StyledContaiteDescriptionP>
            <StyledContaiteDescriptionA href="https://support.1password.com/one-time-passwords/" target="_blank">1Password,</StyledContaiteDescriptionA>
            <StyledContaiteDescriptionA href="https://support.1password.com/one-time-passwords/" target="_blank">Authy,</StyledContaiteDescriptionA>
            <StyledContaiteDescriptionA href="https://support.1password.com/one-time-passwords/" target="_blank">LasPass Authenticator,</StyledContaiteDescriptionA>
            <StyledContaiteDescriptionA href="https://support.1password.com/one-time-passwords/" target="_blank">Microsoft Authenticator,</StyledContaiteDescriptionA>
            <StyledContaiteDescriptionP>etc. to get 2FA codes when prompted during sign-in</StyledContaiteDescriptionP>
            <StyledContaiteDescriptionH3>Scan the QR code</StyledContaiteDescriptionH3>
            <StyledContaiteDescriptionP>Use an authenticator app from your phone to scan. If you are unable to scan,</StyledContaiteDescriptionP>
            <StyledContaiteDescriptionH3>Entry this text code</StyledContaiteDescriptionH3>
            <StyledContaiteDescriptionP>CODE GET BY SERVER</StyledContaiteDescriptionP>
        </StyledContaiteDescription>
        <StyledContaiteQrcode>
            <img src=""/>
        </StyledContaiteQrcode>
            <StyledContaiteDescriptionP>Verify the code from the app</StyledContaiteDescriptionP>
        </StyledContaite>
    )

}

export default SetupOtc;

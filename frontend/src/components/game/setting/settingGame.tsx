import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../../shared/types";
import { StyledBallPong, StyledBallTennis, StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryUserButton, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteSettingGame, StyledContaiteText, StyledContaiteView, StyledSelectBall, StyledViewAvatar } from "../../Styles/StyleViewProfil";
import { SocketContext } from "../../../socket/socketPovider";
import { useNavigate } from "react-router-dom";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { v4 as uuid } from "uuid";

interface IProps {
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
}

const SettingGame:FunctionComponent<IProps> = (props:IProps) =>{
    const socket = useContext(SocketContext);
    const [color, setColor] = useColor("hex", "#121212");
    const [tennis, setTennis] = useState(false);
    const [pong, setPong] = useState(false);
    const [value, setValue] = useState(0);
    const handleClose = ( ) => {
        props.setPopupProfil(false);
    }

    const handleTennis = () =>{
        if (tennis){
            setTennis(false);
        }else{
            setTennis(true);
            setPong(false);
        }
    }

    const handlePong = () =>{
        if (pong){
            setPong(false);
        }else{
            setPong(true);
            setTennis(false);
        }
    }
    return(
        <StyledContaiteSettingGame>
            <ColorPicker width={300} height={100} 
                         color={color} 
                         onChange={setColor} 
                         hideHSV hideHEX hideRGB dark />
            <StyledSelectBall>
                <StyledBallTennis onClick={handleTennis} color={tennis ? color.hex : "transparente"} key={uuid()} className="pongSelect"></StyledBallTennis>
                <StyledBallPong onClick={handlePong}color={pong ? color.hex : "none"} key={uuid()} className="SelectTennis"></StyledBallPong>
            </StyledSelectBall>
            <StyledSelectBall>
                <p onClick={handleClose}>return</p>
                <p>ok</p>
            </StyledSelectBall>
        </StyledContaiteSettingGame>
    )
} 

export default SettingGame;

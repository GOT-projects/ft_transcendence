import { Dispatch, FunctionComponent, useContext, useState } from "react";
import { StyledBallPong, StyledBallTennis, StyledContaiteSettingGame, StyledSelectBall } from "../../Styles/StyleViewProfil";
import { SocketContext, SocketContextGame } from "../../../socket/socketPovider";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { v4 as uuid } from "uuid";
import { emitGame } from "../../../socket/socketEmitGame";
import { GOT } from "../../../shared/types";

enum EnumBall {
    DEFAULT = 'DEFAULT',
    FOOT = 'FOOT',
    TENIS = 'TENIS',
    PONG = 'PONG',
}

interface IProps {
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
   profil: GOT.Profile | undefined;
}

const SettingGame:FunctionComponent<IProps> = (props:IProps) =>{
	const socketGame = useContext(SocketContextGame);
    const [color, setColor] = useColor("hex", "#121212");
    const [tennis, setTennis] = useState(false);
    const [pong, setPong] = useState(false);

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

    const handleSend = () =>{
        if (tennis){
            emitGame.emit_custom(socketGame, {ball: EnumBall.TENIS, color: color.hex}) 
        }else if (pong){
            emitGame.emit_custom(socketGame, {ball: EnumBall.PONG, color: color.hex}) 
        }else{
            emitGame.emit_custom(socketGame, {ball: EnumBall.DEFAULT, color: color.hex}) 
        }
        handleClose()
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
                <p onClick={handleSend}>ok</p>
            </StyledSelectBall>
        </StyledContaiteSettingGame>
    )
} 

export default SettingGame;

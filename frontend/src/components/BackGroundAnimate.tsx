import { useState } from 'react';
import {StyledHexaArea, StyledContainer, StyledGrid} from "./Styles/StyleBackGround"


const BackgroundAnimate = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    document.addEventListener("mousemove", (e) => {
        setX(e.clientX);
        setY(e.clientY);
    });
    const sendX = x.toString() + "px";
    const sendY = y.toString() + "px";
	return (
        <StyledContainer>
            <StyledGrid id="hex-grid">
                <StyledHexaArea className='grid' x="0" y="0"/>
                <StyledHexaArea className='light' x={sendX} y={sendY}/>
            </StyledGrid>
        </StyledContainer>
	)
}

export default BackgroundAnimate;


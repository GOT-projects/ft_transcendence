import { useState } from 'react';
import {StyledHexaArea, StyledContainer, StyledGrid, StyledHexaAreaLight} from "./Styles/StyleBackGround"


const BackgroundAnimate = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    document.addEventListener("mousemove", (e) => {
        setX(e.clientX);
        setY(e.clientY);
    });
    const sendX = x.toString() + "px";
    const sendY = y.toString() + "px";
    const sendW = w.toString() + "px";
    const sendH = h.toString() + "px";
	return (
        <StyledContainer w={sendW} h={sendH}>
            <StyledGrid id="hex-grid">
                <StyledHexaArea className='grid' x="0" y="0" w={sendW} h={sendH}/>
                <StyledHexaAreaLight className='light' x={sendX} y={sendY} w={sendW} h={sendH}/>
            </StyledGrid>
        </StyledContainer>
	)
}

export default BackgroundAnimate;


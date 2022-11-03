import React, { useState } from 'react';
import {Colors} from "./Colors"
import {StyledCursor} from "./Styles/StyleMouse"

const MouseLight = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    document.addEventListener("mousemove", (e) => {
        setX(e.pageX);
        setY(e.pageY);
    });
    var mouseX = x.toString();
    var mouseY = y.toString();
	return (
        <StyledCursor className="cursor" x={mouseX + "px"} y={mouseY + "px"}></StyledCursor>
	)
}

export default MouseLight;

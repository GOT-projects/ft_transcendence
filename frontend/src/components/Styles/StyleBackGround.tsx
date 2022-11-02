
import styled from 'styled-components';
import { Colors } from '../Colors';
import Background from "../../assets/grid.png"

interface mousePos{
    x:string;
    y:string;
}

export const StyledContainer = styled.div`
    background: #2b2b2b;
    display: flex;
    justity-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    cursor: none;
`;

export const StyledGrid = styled.header`
    height: 100vh;
    background: #000;
`;

export const StyledHexaArea = styled.div<mousePos>`
    height: 100vh;
    &.grid{
        position: absolute;
        top: 0;
        left: 0;
        background: url(${Background}) repeat;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-size: 300px;
    }
    &.light{
        position: absolute;
        top: ${p => p.y};
        left: ${p => p.x};
        transform: translate(-50%, -50%);
        width: 6em;
        height: 6em;
        border-radius: 50%;
        filter: blur(15px);
        background: linear-gradient(90deg, #335bf4 0%, #2ae9c9 100%);
        z-index: 0;
    }
`;

export const StyledHexa = styled.div`
`;


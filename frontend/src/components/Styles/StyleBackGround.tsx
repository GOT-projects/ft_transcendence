
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
    @media screen and (max-width: 768px){
        height: 100%;
        width: 130vw;
    }
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
        overflow: hidden;
        @media screen and (max-width: 768px){
            background-size: 200px;
        }
    }
    &.light{
        position: absolute;
        transform: translate(-50%, -50%);
        width: 6em;
        height: 6em;
        border-radius: 50%;
        filter: blur(15px);
        background: linear-gradient(90deg, #335bf4 0%, #2ae9c9 100%);
        z-index: 0;
        @media screen and (max-width: 768px){
            display: none;
        }
    }
`;

export const StyledHexaAreaLight = styled(StyledHexaArea).attrs<mousePos>(p => ({
    style: {
        top: p.y,
        left: p.x,
    },
  }))<mousePos>`
  `;



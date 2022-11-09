
import styled from 'styled-components';
import { Colors } from '../Colors';
import Background from "../../assets/grid.png"

interface mousePos{
    x:string;
    y:string;
    w:string;
    h:string;
}

interface wSize{
    w:string;
    h:string;
}
export const StyledContainer = styled.div<wSize>`
    background: #2b2b2b;
    display: flex;
    justity-content: center;
    align-items: center;
    width: ${p => p.w};
    height: ${p => p.h};
    position: relative;
    cursor: none;
    overflow: hidden;
`;

export const StyledGrid = styled.header`
    background: #000;
    @media screen and (max-width: 768px){
        height: 80vh;
    }
`;


export const StyledHexaArea = styled.div<mousePos>`
    height: 100vh;
    &.grid{
        position: absolute;
        top: 0;
        left: 0;
        background: url(${Background}) repeat;
        width: ${p => p.w};
        height: ${p => p.h};
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



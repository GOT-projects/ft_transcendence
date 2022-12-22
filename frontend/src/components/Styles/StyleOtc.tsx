import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";
/*
interface BgColor{
    color:string;
}
*/
export const StyledContaite = styled(motion.div)`
    position: absolute;
    flex-direction: column;
    width: 500px;
    height: calc(100hv);
    top: 4rem;
    right: 0;
    overflow: scroll;
    border-radius: 0 0 0 20px;
    cursor: auto;
    background-color: ${Colors.ChatMenu};
    opacity: 1;
    text-align: justify;
`;

export const StyledContaiteDescription = styled.span`
    display: inline-block;
    margin: 10px;
    white-space: wrap;
`

export const StyledContaiteQrcode = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

export const StyledContaiteDescriptionH1 = styled.h1`
    margin: 10px;
    font-size: 20px;
    color: ${Colors.darkText}
`

export const StyledContaiteDescriptionP = styled.p`
    margin: 10px;
    font-size: 14px;
    color: ${Colors.darkText}
`

export const StyledContaiteDescriptionH3 = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: ${Colors.darkText}
`

export const StyledContaiteDescriptionA = styled.a`
    text-decoration: underline;
    margin-right: 5px;
    font-size: 14px;
    color: ${Colors.darkText};
    transition: 0.6s;
    &:hover{
        color: ${Colors.ChatMenuButtonHover};
        transition: 0.6s;
    }
`

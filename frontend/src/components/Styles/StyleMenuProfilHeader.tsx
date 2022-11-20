import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";

export const StyledMenuProfile = styled(motion.div)`
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    top: 3.6rem;
    right: 0;
    width: 200px;
    height: 236px;
    background: #2c99de;
    transition: 0.4x;
    font-family: "Public Pixel";
    border-radius: 0 0 0 20px;
`

export const StyledMenuProfileUsername = styled(motion.div)`
    position: absolute;
    overflow: hidden;
    display: flex;
    align-items: center;
    top: 0rem;
    right: 0;
    width: 200px;
    height: 236px;
    background: #2c99de;
    transition: 0.4x;
    font-family: "Public Pixel";
    border-radius: 0 0 0 20px;
`

export const StyledMenuProfileUsernameOption = styled.div`
    display: flex;
    flex-direction: center;
    justify-content: space-between;
`

export const StyledMenuProfileUsernameContente = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 60%;

`
export const StyledMenuProfileUsernameTitle = styled.h1`
    font-size: 12px;
    margin: 0 0 0 10px;
`
export const StyledMenuProfileUsernameInput = styled.input`
    margin-left: 1px;
    width: 190px;
    height: 20px;
    font-size: 18px;
    border-radius: 10px;
`

export const StyledMenuProfileUsernameButton = styled.button`
    margin: 10px;
    padding: 10px 20px 10px 20px;
    border-radius: 20px;
    border: none;
    background-color: ${Colors.ChatMenuButton};
    color: ${Colors.darkText};
    text-align: center;
    text-decoration: none;
    transition: 0.6s;
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.6s;
`

export  const StyleMenuHeaderProfilOption = styled.div`
    padding: 15px;
    color: ${Colors.primary};
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        transform: translateX(10px);
    }
`
export  const StyleMenuHeaderProfilData = styled.div`
    padding: 15px;
    color: ${Colors.primary};
    font-size: 10px;
`

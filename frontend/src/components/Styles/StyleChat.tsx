import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'

interface BgColor{
    color:string;
}
export const StyledContaite = styled.div`
    position: absolute;
    display: flex;
    align-items: space-around;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 86%;
    overflow: hidden;
    border: 2px solid ${Colors.border};
    border-radius: 20px;
    background-color: ${Colors.dark1};
    opacity: 0.6;
    cursor: pointer;
    @media screen and (max-width: 768px){
        height: 76%;
    }
`;
export const StyledContact = styled.div`
    width: 40%;
    height: 104%;
    display: flex;
    margin: 0;
    padding: 0;
    align-items: space-around;
    flex-direction: column;
    background-color: ${Colors.ChatMenu};
    border: 2px solid ${Colors.ChatMenuButton};
`;
export const StyledChatSep = styled.div`
    width: 100%;
    height: 2px;
    border-radius: 50%;
    background-color: ${Colors.primary}
`;

export const StyledChatSwith = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 15px;
    height: 4rem;
    border-radius: 10px 0 0 0;
    background-color: ${Colors.ChatMenu};
    @media screen and (max-width: 768px){
        margin: 10px;
        height: 7rem;
        flex-direction: column;
        align-items: center;
    }
`;

export const StyledChatPrive = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px 0 0 10px;
    height: 90%;
    width: 100%;
    overflow: scroll;
`;

export const DisplayPrive = styled.div`
    &.prive{
        display: block;
    }
    &.channel{
        display: none;
    }
`;

export const DisplayChannel = styled.div`
    &.prive{
        display: none;
    }
    &.channel{
        display: block;
    }
`;
export const StyledChatSwithButton = styled.button`
    width: 120px;
    height: 30px;
    border-radius: 20px;
    margin-top: 10px;
    border: 0;
    color: ${Colors.ChatMenuButtonText};
    background-color: ${Colors.ChatMenuButton};
    font-family: 'Public Pixel', cursive;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.4s;
    }
    @media screen and (max-width: 768px){
        width: 90%;
        font-size: 8px;
    }
`;

export const StyledChatSettingButton = styled.button`
    border: 0;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    background-color: ${Colors.ChatMenuButton};
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.4s;
    }
    @media screen and (max-width: 768px){
        background-color: transparent;
        &:hover{
            background-color: transparent;
        }
    }
`;

export const StyledChatTextArea = styled.div`
    overflow: scroll;
`;

export const StyledChat = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 67%;
    margin: 0;
    height: 103%;
    margin-left: 10px;
    padding: 0px;
    background-color: ${Colors.ChatMenu};
    @media screen and (max-width: 768px){
        margin: 6px;
        width: 70%;
    }
`;

export const StyledChatWindow = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 10px;
    width: 96%;
    height: 90%;
    @media screen and (max-width: 768px){
        width: 90%;
        height: 80%;
    }   
`;

export const StyledChatPlace = styled.div`
    display:flex;
    margin: 10px;
    max-width: 45%;
    height: auto;
    border-radius: 20px;
    overflow-wrap: anywhere;
    hyphens: auto;
    &.receive{
        justify-content: flex-start;
        background-color: blue;
        text-align: left;
    }
    &.send{
        justify-content: flex-end;
        background-color: red;
        transform: translateX(110%)
    }
    @media screen and (max-width: 768px){
        transform: translateX(0%)
        max-width: 90%;
        color: ${Colors.primary};
    }
`;

export const StyledChatText = styled.p`
    margin: 10px;
    font-size:14px; 
    font-family: "Public Pixel";
    color: ${Colors.primary}
    @media screen and (max-width: 768px){
        margin: 10px;
        font-size:8px; 
        font-family: "Public Pixel";
    }
`;

export const StyledChatSendDiv = styled.form`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 96%;
    margin: 10px;
    border-radius: 10px;
    &.deactive{
        display: none;
    }
    @media screen and (max-width: 768px){
        width: 90%;
        
    }
`;
export const StyledChatInput = styled.textarea`
    position: relative;
    font-family: "Public Pixel";
    padding: 6px;
    width: 100%;
    font-size: 14px;
    height: auto;
    margin: 10px;
    border-radius: 10px;
    @media screen and (max-width: 768px){
        font-size: 8px;
    }
`;

export const StyledSender = styled.button`
    background-color: transparent;
    background-repeat: no-repeat;
    width: 50px;
    height: 40px;
    border: none;
    cursor: pointer;
    overflow: hidden;
    outline: none;
    transition: 0.4s;
    border-radius: 20%;
    &:hover{
        transition: 0.4s;
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.4s;
    }
`;
export const StyledUser = styled.button<BgColor>`
    display: flex;
    margin: 10px;
    width: 100%;
    height: 60px;
    border-radius: 0;
    border: 0;
    align-items: center;
    justify-content: space-between;
    background-color: ${p => p.color};
    justify-content: space-around;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButton};
        transition: 0.4s;
    }
    @media screen and (max-width: 768px){
        margin: 6px;
        font-size: 8px;
    }
`;


export const StyledChatPrivAvatar = styled.div`
    margin: 10px;
    width: 50px;
    height: 50px;
    background-color: red;
    border-radius: 50%;
    @media screen and (max-width: 768px){
        display: none;
    }
`;

export const StyledChatPrivName = styled.p`
    margin: 10px;
    font-family: 'Public Pixel', cursive;
    color: ${Colors.ChatMenuButtonText}
`;

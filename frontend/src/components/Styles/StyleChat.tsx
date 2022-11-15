import styled from 'styled-components';
import {Colors} from "../Colors"
// import {Link} from 'react-router-dom'

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
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top: 4rem;
        left: 0;
        transform: translate(0, 0);
        border: none;
        border-radius: 0;
        background-color: transparent;
    }
`;

export const StyledAddInput = styled.input`
    margin: 20px;
    width: 70%;
    height: 30px;
    font-size: 18px;
    border-radius: 10px;
`;

export const StyledAddInputdiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

export const StyledAddInputdivAdd = styled.div`
    width: 20px;
    height: 2px;
    background-color: pink;
`;

export const StyledAddInputdivButton = styled.div`
    margin: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${Colors.ChatMenuButton};
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
    }
`;

export const StyledMenuSwitch = styled.div`
    display: none;
    @media screen and (max-width: 768px){
        display: flex;
        align-items: center;
    }
`;

export const StyledMenuNav = styled.div`
    display: none;
    @media screen and (max-width: 768px){
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 10px;
        width: 100%;
        height: 10%;
    }
`;

export const StyledMenuDiv = styled.div`
    margin: 6px;
    width: 40px;
    height: 3px;
    border-radius: 2px;
    &.ActiveMenu{
background-color: ${Colors.MenuActive}
    }
    &.UnActiveMenu{
        background-color: ${Colors.MenuDisable}
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
    @media screen and (max-width: 768px){
        &.UnActiveMenu{
            display: none;
         }
         &.ActiveMenu{
            display: flex;
            width: 100%;
            height: 100%;
         }
    }
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
        display: none;
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
    @media screen and (max-width: 768px){
        display: block;
        height: 90%;
        width: 100%;
    }
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
export const StyledChatSwithButton = styled.button<BgColor>`
    width: 120px;
    height: 30px;
    border-radius: 20px;
    margin-top: 10px;
    border: 0;
    color: ${Colors.ChatMenuButtonText};
    background-color: ${p => p.color};
    font-family: 'Public Pixel', cursive;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.4s;
    }
    @media screen and (max-width: 768px){
        width: 40%;
        margin: 8px;
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
    height: 100%;
    margin-left: 10px;
    padding: 0px;
    background-color: ${Colors.ChatMenu};
    @media screen and (max-width: 768px){
        width: 100%;
        height: calc(100% - 6rem - 50px);
        margin: 0;
    }
`;

export const StyledChatWindow = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 10px;
    width: 100%;
    height: 100%;
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
    margin-bottom: 40px;
    border-radius: 10px;
    @media screen and (max-width: 768px){
        margin-bottom: 20px;
        font-size: 8px;
    }
`;

export const StyledSender = styled.button`
    margin-bottom: 10px;
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
        font-size: 16px;
    }
`;


export const StyledChatPrivAvatar = styled.div`
    margin: 10px;
    width: 50px;
    height: 50px;
    background-color: red;
    border-radius: 50%;
`;

export const StyledChatPrivName = styled.p`
    margin: 10px;
	width: 200px;
	text-align: left;
    font-family: 'Public Pixel', cursive;
	overflow: hidden;
    color: ${Colors.ChatMenuButtonText}
`;

import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'

interface BgColor{
    color:string;
}
export const StyledContaite = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
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
`;
export const StyledContact = styled.div`
    width: 30%;
    height: 98%;
    margin: 15px;
    display: flex;
    flex-direction: column;
    border-radius: 10px 0 0 10px;
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
    height: 4rem;
    border-radius: 10px 0 0 0;
    background-color: ${Colors.light};
    background-color: ${Colors.ChatMenu}
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

export const StyledChatSwithButton = styled.button`
    width: 120px;
    height: 30px;
    border-radius: 20px;
    border: 0;
    color: ${Colors.ChatMenuButtonText};
    background-color: ${Colors.ChatMenuButton};
    font-family: 'Public Pixel', cursive;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButtonHover};
        transition: 0.4s;
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
`;

export const StyledChat = styled.div`
    position: relative;
    width: 65%;
    height: 98%;
    margin: 10px;
    border-radius: 0px 10px 10px 0;
    border: 2px solid ${Colors.border};
    background-color: ${Colors.ChatMenu};
`;

export const StyledChatWindow = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin: 10px;
    width: 96%;
    height: 90%;
`;

export const StyledChatPlace = styled.div`
    display:flex;
    margin: 10px;
    max-width: 45%;
    justify-content: flex-end;
    border-radius: 20px;
    &.receive{
        background-color: blue;
    }
    &.send{
        background-color: red;
        transform: translateX(110%)
    }
`;

export const StyledChatText = styled.div`
    margin: 10px;
    font-size:18px; 
    color: ${Colors.primary}
`;

export const StyledChatSendDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 96%;
    height: 6%;
    margin: 10px;
    border-radius: 10px;
`;
export const StyledChatInput = styled.input`
    position: relative;
    padding: 6px;
    width: 80%;
    height: 100%;
    font-size: 20px;
    height: auto;
    margin: 10px;
    border-radius: 10px;
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
    background-color: ${p => p.color};
    justify-content: space-around;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButton};
        transition: 0.4s;
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
    font-family: 'Public Pixel', cursive;
    color: ${Colors.ChatMenuButtonText}
`;

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
    top: 4.1rem;
    left: 50%;
    transform: translate(-50%, -0%);
    width: 90%;
    height: calc(100% - 7rem);
    overflow: hidden;
    border: 2px solid ${Colors.border};
    border-radius: 20px;
    background-color: ${Colors.Bg2fa};
    opacity: 0.6;
    cursor: pointer;
    @media screen and (max-width: 768px){
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

//Par list user Privmsg
export const StyledContact = styled.div`
    display: flex;
    max-width:  400px;
    min-width:  200px;
    height: 104%;
    margin: 0;
    padding: 0;
    justify-content: flex-start;
    flex-direction: column;
    background-color: ${Colors.ChatMenu};
    border: 2px solid ${Colors.ChatMenuButton};
    transition: 0.6s;
    @media screen and (max-width: 768px){
        &.UnActiveMenu{
            z-index: 18;
            width: 500px;
            height: calc(100% - 6rem);
            transform: translate(-800px);
            transition: 0.6s;
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
    height: 80px;
    border-radius: 10px 0 0 0;
    background-color: ${Colors.ChatMenu};
`;
export const StyledChatSwithTile = styled.div`
    font-size: 20px;
    font-family: "Public Pixel";
    margin: 10px;
    color: ${Colors.primary};
`

export const StyledChatPrive = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px 0 0 10px;
    height: calc(100% - 80px - 6rem);
    width: 100%;
    overflow: scroll;
`;

export const StyledSettingChan = styled.div`
    display: flex;
    align-items: center;
    height: 4rem;
    justify-content: space-between;
`
export const StyledSettingChanP = styled.p`
    color: ${Colors.primary};
    font-family: "cursive";
    font-size: 20px;
    margin: 10px;
`


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
`;
export const StyledChatDivhandle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
`
export const StyledChatDivoption = styled.div`
    display: flex;
    gap: 3px;
    cursor: pointer;
`
export const StyledChatDivEmpty = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    width: 50px;
    height: 50px;
`

export const StyledChatSettingButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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
        width: 40px;
        height: 40px;
    }
`;

export const StyledChatTextArea = styled.div`
    overflow: scroll;
`;

//Privmsg 
export const StyledChat = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(100% - 450px);
    margin: 0;
    height: 100%;
    margin-left: 10px;
    padding: 0px;
    background-color: ${Colors.ChatMenu};
    transition: 0.9s;
    @media screen and (max-width: 768px){
        &.UnActiveMenu{
            position: absolute;
            width: 80%;
            height: calc(100% - 6rem);
            transition: 0.9s;
            left: 90px;
        }
        &.ActiveMenu{
            display: none;
            transform: translate(400px);
            transition: 0.9s;
        }
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

export const StyledChatNameUser = styled.p`
    margin-left: 10px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10px;
    color: ${Colors.grey};
`

export const StyledChatPlace = styled.div`
    display:flex;
    flex-direction: column;
    margin: 10px;
    max-width: 45%;
    height: auto;
    border-radius: 4px;
    overflow-wrap: anywhere;
    hyphens: auto;
    transition: 0.6s;
    background-color: transparent;
    &.receive{
        justify-content: flex-start;
        text-align: left;
    }
    &.send{
        justify-content: flex-end;
        transform: translateX(110%);
        align-items: flex-end;
    }
    &:hover{
        &.send{
            transition: 0.6s;
            background-color: ${Colors.hoverTextChat};
        }
        &.receive{
            transition: 0.6s;
            background-color: ${Colors.hoverTextChat};
        }
    }
    @media screen and (max-width: 768px){
    }
`;

export const StyledChatText = styled.pre`
    margin: 10px;
    font-size:14px; 
    font-family: "Public Pixel";
    color: ${Colors.primary};
    @media screen and (max-width: 768px){
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
    margin: 10px;
    font-size: 14px;
    height: auto;
    margin-bottom: 40px;
    border-radius: 10px;
    @media screen and (max-width: 768px){
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
    height: 60px;
    width: 400px;
    border-radius: 20px;
    border: 0;
    align-items: center;
    justify-content: row;
    flex-flow: column wrap;
    background-color: ${p => p.color};
    justify-content: space-around;
    transition: 0.4s;
    &:hover{
        background-color: ${Colors.ChatMenuButton};
        transition: 0.4s;
    }
    @media screen and (max-width: 768px){
        width: 350px;
    }
`;


interface Ibg{
    profil:string;
}
export const StyledChatPrivAvatar = styled.div<Ibg>`
    margin: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: url(${p => p.profil});
    background-size: 100% 100%;
    @media screen and (max-width: 768px){
        margin-left: 25px;
    }
`;

export const StyledChatPrivName = styled.p`
    margin: 10px;
	width: 100px;
	text-align: left;
    font-family: 'Public Pixel', cursive;
    font-size: 20px;
	overflow: hidden;
    color: ${Colors.ChatMenuButtonText};
    @media screen and (max-width: 768px){
	    width: 70px;
        font-size: 14px;
    }
`;

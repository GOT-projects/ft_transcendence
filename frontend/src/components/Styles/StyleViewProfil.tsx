import styled from 'styled-components';
import {Colors} from "../Colors"
// import {Link} from 'react-router-dom'

interface BgColor{
    color:string;
}
export const StyledContaiteViewAddChan = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 300px;
    overflow: hidden;
    z-index: 10;
    top: 50%;
    left: 50%;
    background-color: ${Colors.primary};
    transform: translate(-50%, -50%);
    border: 2px solid ${Colors.border};
    border-radius: 10px;
    opacity: 1;
`
export const StyledContaiteReturn = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
`
export const StyledContaiteReturnAddChannel = styled.div`
    display: flex;
    align-items: center;
    width: 100px;
    height: 140px;
`

export const StyledContaiteReturnDiv = styled.div`
    display: flex;
    align-items: flex-start;
    width: 80px;
    height: 80px;
    margin-top: -10px;
    margin-left: 10px;
`
export const StyledContaiteAddUser = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    font-family: "curve";
    font-size: 20px;
`
export const StyledContaiteViewAddP = styled.p`
    margin: 10px;
    font-family: "curve";
    font-size: 20px;
    color: ${Colors.Bg2fa};
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        color: ${Colors.primary};
    }

`

export const StyledContaiteViewAddOption = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
    width: 90%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid ${Colors.Bg2fa};
    background-color: ${Colors.primary};
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        background-color: ${Colors.Bg2faIn};
    }
`

export const StyledContaiteView = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 600px;
    overflow: hidden;
    border: 2px solid ${Colors.border};
    border-radius: 20px;
    background-color: ${Colors.dark2};
    opacity: 0.9;
`;

export const StyledContaiteMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    height: 100%;
    background-color: ${Colors.Bg2faIn};
`
export const StyledContaiteChannel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    height: 100%;
    overflow: scroll;
    background-color: ${Colors.Bg2faIn};
`
export const StyledChanSep = styled.div`
    margin-left: 10px;
    width: 80%;
    height: 4px;
    border-radius: 2px;
    background-color: ${Colors.Bg2fa};
`
export const StyledChanPadd = styled.p`
    font-size: 20px;
`

export const StyledChanDiv = styled.div`
    display: flex;
    margin: 20px;
    margin-right: 10px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: ${Colors.bgChannel};
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        border-radius: 20%;
    }
`


export const StyledContaiteAddChanDiv = styled.div`
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    align-items: center;
    justify-content: space-between;
`
interface Icolor{
    color:string;
}
export const StyledContaiteAddChanOption = styled.div<Icolor>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 30px;
    border: 2px solid ${Colors.Bg2fa};
    border-radius: 10px;
    background-color: ${p => p.color};
`
export const StyledContaiteAddChanOptionP = styled.div<Icolor>`
    color: ${p => p.color};
`

export const StyledContaiteClose = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: row-reverse;
    align-items: center;
    cursor: pointer;
`

export const StyledContaiteRank = styled.div`
    display: flex;
    margin: 10px;
    flex-direction: row-reverse;
    align-items: center;
`
export const StyledContaiteHistorytile = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    border: 2px solid ${Colors.border};
    border-radius: 20px;
`
export const StyledContaiteHistory = styled.div`
    display: flex;
    margin: 10px;
    height: 100%;
    flex-direction: column;
    overflow: scroll;
    background-color: ${Colors.ChatMenu};
    align-items: center;
    border: 2px solid ${Colors.border};
    border-radius: 24px;
`
export const StyledContaiteHistorylst = styled.div`
    display: flex;
    margin: 10px;
    width: 100%;
    align-items: center;
`
export const StyledContaiteHistoryUser = styled.div`
    display: flex;
    margin: 10px;
    width: 100px;
    overflow: hidden;
`

export const StyledContaiteHistoryScore = styled.div`
    display: flex;
    margin: 10px;
    overflow: hidden;
`
export const StyledContaiteHistoryVs = styled.div`
    display: flex;
    margin: 10px;
    width: 18px;
`

interface Isize{
    size:string; 
}
export const StyledContaiteText = styled.p<Isize>`
    font-family: "Public Pixel";
    color: ${Colors.dark1};
    font-size: ${p => p.size};

`

export const StyledContaiteProfil = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

interface Ibg{
    profilImg:string | null |undefined;
}
export const StyledViewAvatar = styled.div<Ibg>`
    margin: 10px;
    width: 50px;
    height: 50px;
    background: url(${p => p.profilImg});
    background-size: 100% 100%;
    border-radius: 50%;
`;

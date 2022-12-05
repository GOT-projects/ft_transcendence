import styled from 'styled-components';
import {Colors} from "../Colors"
// import {Link} from 'react-router-dom'

interface BgColor{
    color:string;
}

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
`;

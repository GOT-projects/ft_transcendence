import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'

export const StyledLead = styled.div`
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
    overflow: scroll;
    border: 2px solid ${Colors.border};
    border-radius: 2%;
    background-color: ${Colors.dark1};
    opacity: 0.6;
`;

export const StyledTile = styled.h1`
    margin: 20px;
    font-family: 'Public Pixel';
    color: ${Colors.primary};
`;

export const StyledSep = styled.div`
    width: 100%;
    height: 3px;
    background-color:red;
    border-radius: 1px;
    background: ${Colors.Sep};
    opacity: 1;
    filter: blur(3px);
`;

interface colorLead{
    color: string;
}
export const StyledLeadTile = styled.table<colorLead>`
    margin: 10px;
    padding: 0;
    width: 98%;
    table-layout: fixed;
    background: ${p => p.color};
    border: 2px solid ${Colors.grey};
    border-radius: 4px;
`;

export const StyledLeadBorder = styled.div`
    margin: 20px;
    background: ${Colors.Rank};
    border: 2px solid ${Colors.grey};
    border-radius: 4px;
`;


export const StyledLeadP = styled.td`
    margin: 20px;
    width: 10px;
    font-family: "Public Pixel";
    text-align: left;
    opacity: 1;
    color: ${Colors.primary};
`;

import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'


export const Button = styled.button`
postion: absolute;
  width: 400%;
  background-color: black;
  color: white;
  font-size: 20px;
  display: auto;
  text-align: center;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

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
    border-radius: 20px;
    background-image: url(https://ns328286.ip-37-187-113.eu/ew/wallpapers/800x480/10602_800x480.jpg);
    background-size: cover;
    opacity: 0.7;
`;

export const StyledTile = styled.h1`
    margin: 20px;
    font-family: 'Public Pixel';
    color: ${Colors.primary};
`;

export const StyledSep = styled.div`
    width: 100%;
    height: 3px;
    border-radius: 1px;
    background: ${Colors.Sep};
    opacity: 1;
    filter: blur(3px);
`;

interface colorLead{
    color: string;
}

export const StyledLeadTileRank = styled.table<colorLead>`
    margin: 10px;
    padding: 6px;
    width: 98%;
    table-layout: fixed;
    transition: 0.6s;
`;

export const StyledLeadTile = styled.table<colorLead>`
    margin: 10px;
    padding: 6px;
    width: 98%;
    table-layout: fixed;
    &:hover{
        transition: 0.4s;
    }
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
    padding: 6px;
    font-family: "Public Pixel";
    text-align: left;
    opacity: 1;
    color: ${Colors.primary};

`;

export const StyledLeadB = styled.button`
background-color: transparent;
background-opacity: 0;
    margin: 20px;
    width: 75%;
    padding: 6px;
    font-family: "Public Pixel";
    color: black;
    text-align: left;
    opacity: 1;
    color: ${Colors.primary};
    cursor: pointer;
    border: none;
`;
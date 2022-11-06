
import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'

export const StyledHeader = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    top: 0;
    width: 100%;
    height: 4rem;
    cursor: pointer;
    opacity: 0.9;
    z-index: 20;
    background: ${Colors.HeaderColor};
    &.ActiveMenu{
        transition: 0.8s;
    }
    transition: 0.8s;
    @media screen and (max-width: 768px){
        display: block;
    }
`;

export const StyleMenusHeader = styled.ul`
    display: flex;
    position: absolute;
    align-items: center;
    @media screen and (max-width: 768px){
        top: 3rem;
        right: 0;
        width: 35%;
        height: 15rem;
        padding: 5px;
        align-items: flex-start;
        border-left: 2px solid ${Colors.border};
        border-bottom: 2px solid ${Colors.border};
        border-radius: 0 0px 0px 20px;
        flex-direction: column;
        transition: 1s;
        &.ActiveMenu{
            transform: translateY(0);
            transition: 1s;
            background: ${Colors.HeaderColor};
        }
        &.UnActiveMenu{
            display: none;
            transform: translateY(-100%);
            transition: 1s;
        }
    }
`;

interface Menu{
    colortext: string;
}

export const StyleMenuHeader = styled(Link)<Menu>`
    color: ${props => props.colortext};
    font-family: 'Public Pixel', cursive;
    font-size: 18px; 
    text-decoration: none;
    list-style: none;
    padding: 15px;
    transition: 0.8s;
    &:hover{
        transition: 0.8s;
        color: ${Colors.grey};
        transform: translate(0, -10px);
        cursor: pointer;
    }
`;

export const StyleMenuHeaderProfil = styled(Link)`
    color: ${Colors.MenuDisable};
    font-size: 20px; 
    margin: 10px;
    width: 20px;
    height: 20px;
    border: 2px solid;
    border-radius: 50%;
    background-color: grey;
    text-decoration: none;
    list-style: none;
    padding: 15px;
    transition: 0.8s;
    &:hover{
        transition: 0.8s;
        color: ${Colors.grey};
        transform: translate(3px, 0);
        cursor: pointer;
    }
    @media screen and (max-width: 768px){
        margin: 0;
        padding: 10px;
    }

`;

export const StyleNavToggler = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin: 8px;
`;

export const StyleNavTogglerIcon = styled.div`
    width: 40px;
    height: 5px;
    margin: 5px;
    display: none;
    cursor: pointer;
    border-radius: 4px;
    background-color: ${Colors.dark1};
    display: none;
    &.ActiveMenu{
       transition: 0.8s;
       background: gray;
    }
    transition: 0.8s;
    @media screen and (max-width: 768px){
       display: block;
    }
`;

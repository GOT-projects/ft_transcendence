import styled from 'styled-components';
import {Colors} from "../Colors"
import background from "../../assets/hexaGid.png"


interface PropsLogo {
  height: string;
  width: string;
  img:string;
}

export const StyledLogin = styled.body`
	display: flex;
    position: absolute;
	align-items: center;
    top: 0;
    left: 0;
    min-height: 100vh;
    width: 100%;
	justify-content: center;
	flex-direction: column;
    background-size: cover;
    background-position: center;
    z-index: 10;
    cursor: none;
`;


export const StyledLoginLogo = styled.div<PropsLogo>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background-image: url(${props => props.img});
    opacity: 0.8;
    margin: 15px;
`;
export const StyledLoginButton = styled.button`
    font-size: 40px;
    border: 4px solid;
    font-family: 'Droid Sans';
	weight: 30rem;	
	height: 5rem;
    padding-left: 50px;
    padding-right: 50px;
	border-radius: 40px;
    cursor: pointer;
    opacity: 0.6;
	color: ${Colors.dark1};
    border-color: ${Colors.dark2};
	background-color: ${Colors.primary};
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        transform: translate(0, -10px);
        border-color: ${Colors.border};
	    color: ${Colors.border};
    }
`;

import styled from 'styled-components';
import {Colors} from "../Colors"
import {Link} from 'react-router-dom'


interface PropsLogo {
  height: string;
  width: string;
  img:string;
}

export const StyledLogin = styled.div`
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
    @media screen and (max-width: 768px){
        height: 80%;
    }
`;


export const StyledLoginLogo = styled.div<PropsLogo>`
    width: ${(props)=> props.width};
    height: ${(props) => props.height};
    background-size: cover;
    background-position: center;
    background-image: url(${props => props.img});
    background-size: ${(props) => props.width};
    opacity: 0.8;
    margin: 15px;
    @media screen and (max-width: 768px){
        width: 210px;
        height: 100px;
        background-size: 210px;
    }
`;
export const StyledLoginButton = styled(Link)`
    width: 380px;
    height: 86px;
    font-size: 28px;
    font-family: 'Public Pixel', cursive;
    background: linear-gradient(45deg, transparent 5%, ${Colors.dark1} 5%);
    border: 1px solid;
    border: 0;
    text-decoration: none;
    text-align: center;
    color: #fff;
    letter-spacing: 3px;
    line-height: 88px;
    box-shadow: 6px 0px 0px ${Colors.border};
    outline: transparent;
    position: relative;
    @media screen and (max-width: 768px){
        width: 210px;
        height: 100px;
        background-size: 210px;
        width: 160px;
        height: 46px;
        font-size: 14px;
        line-height: 44px;
    }
    &:after {
        --slice-0: inset(50% 50% 50% 50%);
        --slice-1: inset(80% -6px 0 0);
        --slice-2: inset(50% -6px 30% 0);
        --slice-3: inset(10% -6px 85% 0);
        --slice-4: inset(40% -6px 43% 0);
        --slice-5: inset(80% -6px 5% 0);
        content: 'Login Intra';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 3%, ${Colors.border} 3%, ${Colors.border} 5%, ${Colors.dark1} 5%);
        text-shadow: -3px -3px 0px ${Colors.dark1}, 3px 3px 0px ${Colors.border};
        clip-path: var(--slice-0);
    }
    &:hover::after {
        animation: 1s glitch;
        animation-timing-function: steps(2, end);
    }
    
    @keyframes glitch {
      0% {
        clip-path: var(--slice-1);
        transform: translate(-20px, -10px);
      }
      10% {
        clip-path: var(--slice-3);
        transform: translate(10px, 10px);
      }
      20% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 10px);
      }
      30% {
        clip-path: var(--slice-3);
        transform: translate(0px, 5px);
      }
      40% {
        clip-path: var(--slice-2);
        transform: translate(-5px, 0px);
      }
      50% {
        clip-path: var(--slice-3);
        transform: translate(5px, 0px);
      }
      60% {
        clip-path: var(--slice-4);
        transform: translate(5px, 10px);
      }
      70% {
        clip-path: var(--slice-2);
        transform: translate(-10px, 10px);
      }
      80% {
        clip-path: var(--slice-5);
        transform: translate(20px, -10px);
      }
      90% {
        clip-path: var(--slice-1);
        transform: translate(-10px, 0px);
      }
      100% {
        clip-path: var(--slice-1);
        transform: translate(0);
      }
    }
`;

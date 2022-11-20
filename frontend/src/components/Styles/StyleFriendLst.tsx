import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";

export const StyledMenuFriend = styled(motion.div)`
    position: absolute;
    top: 3.6rem;
    right: 0;
    width: 300px;
    height: 100vh;
    background: #2c99de;
    transition: 0.4x;
    font-family: "Public Pixel";
    border-radius: 0 0 0 20px;
`

export const StyledMenuFriendContente = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px;
    width: 100%;
    height: 100%;
    overflow: scroll;
`

export const StyleMenuFriendUser = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: 0.6s;
    &:hover{
        transition: 0.6s;
        transform: translateX(-15px);
    }
`


export const StyledMenuFriendImgContente = styled.div`
    margin: 15px;
    width: 50px;
    height: 50px;
`

interface Img{
    img:string;
}
interface Status{
    statusColor:string;
}

export const StyledMenuFriendImg = styled.div<Img>`
    position: relative;
    z-index: 59;
    width: 40px;
    height:40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: url(${props=> props.img} );
    background-position: center;
    background-size: 100% 100%;
`

export const StyledMenuFriendStatus= styled.div<Status> `
    position: relative;
    z-index: 60;
    width: 15px;
    height:15px;
    transform: translate(205%, -60%);
    border-radius: 50%;
    background: ${props => props.statusColor};
`
export const StyledMenuFriendStatusBehind = styled.div`
    position: relative;
    z-index: 59;
    width: 21px;
    height:21px;
    transform: translate(130%, -128%);
    border-radius: 50%;
    background: ${Colors.HeaderColors};
`


import styled from 'styled-components';
import {Colors} from "../Colors"
import { motion } from "framer-motion";

export const StyledMenuNotif = styled(motion.div)`
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    top: 3.6rem;
    right: 0;
    width: 200px;
    height: 250px;
    background: ${Colors.HeaderColors};
    transition: 0.4x;
    font-family: "Public Pixel";
    border-radius: 0 0 0 20px;
`
export const StyledMenuNotifholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 0.4s;
    &:hover{
        transition: 0.4s;
        background: ${Colors.grey};
    }
`
export const StyledMenuNotifButton = styled.div`
    display: flex;
    width: 60px;
    margin-right: 4px;
    align-items: center;
    justify-content: space-between;
`
export const StyledMenuNotifButtonHover = styled.div`
    color: ${Colors.ChatMenu};
    &:hover{
        color: ${Colors.primary};
    }
`
export const StyledMenuNotifContentUser = styled.div`
    width: 120px;
    overflow: hidden;
`
export const StyledMenuNotifUser = styled.p`
    margin-left: 4px;
    color: ${Colors.primary};
`

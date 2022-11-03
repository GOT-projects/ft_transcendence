import {StyledHeader, StyleMenusHeader ,StyleMenuHeader, StyleNavToggler, StyleNavTogglerIcon} from "./Styles/StyledHeader"
import { useState, useEffect, useCallback } from "react";


const Header= (props: any)=> {
    const [active, setActive] = useState("UnActiveMenu");
    const {colorHome, colorGame, colorLeadBoard, colorChat} = props;
    const handleScroll = useCallback(() => {
        setActive("UnActiveMenu");
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
    }, [handleScroll])

    const navMenu = () => {
        if (active === "ActiveMenu") {
            setActive("UnActiveMenu");
        } else setActive("ActiveMenu");
    }
	return (
        <StyledHeader>
            <StyleMenusHeader className={active}>
                <StyleMenuHeader colortext={colorHome} to='/'>Home</StyleMenuHeader>
                <StyleMenuHeader colortext={colorGame}to="/game">Game</StyleMenuHeader>
                <StyleMenuHeader colortext={colorLeadBoard} to='/leaderboard'>LeaderBoard</StyleMenuHeader>
                <StyleMenuHeader colortext={colorChat} to='/chat'>Chat</StyleMenuHeader>
            </StyleMenusHeader>
            <StyleNavToggler onClick={navMenu} className={active}>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
                <StyleNavTogglerIcon className={active}></StyleNavTogglerIcon>
            </StyleNavToggler>
        </StyledHeader>
	)
}

export default Header;


import {StyledLogin, StyledLoginLogo, StyledLoginButton} from "../components/Styles/StylesLogin"
import BackgroundAnimate from "../components/BackGroundAnimate";
import Logo from "../assets/Logo.png"
import Header from "../components/Header"
import Footer from "../components/Footer";
import {Colors} from "../components/Colors"
import React, { useState } from 'react'
import {Notification} from "../components/Notify"
import {NotifyInter} from "../components/interfaces"
import { accountService } from "../services/account.service";
import { apiGet } from "../api/get";

const Profil = () => {

	return (
		<React.Fragment>
			<BackgroundAnimate name="Profil"/>
			<Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuDisable} colorLeadBoard={Colors.MenuActive} colorChat={Colors.MenuDisable}/>
			<Footer/>
		</React.Fragment>
	)
}

export default Profil;


import {useEffect, useState} from 'react';
import {StyledLogin, StyledLoginTitle, StyledLoginButton} from "../components/Styles/StylesLogin"
import {Colors} from "../components/Colors"


const Login = () => {
	const size:number = window.innerHeight;
	document.body.style.backgroundColor = Colors.dark1;
	var sizeHeight:string = size.toString();
	sizeHeight = sizeHeight + "px";
	return (
		<StyledLogin height={sizeHeight}>
			<StyledLoginTitle>Ping Pong</StyledLoginTitle>
			<StyledLoginButton>Login Intra</StyledLoginButton>
		</StyledLogin>
	)
}

export default Login;

import { apiGet } from "../api/get";

let saveToken = (token: string) => {
	document.cookie = `token_access= ${token}; expires= ; path=/`;
	localStorage.setItem('token_access', token)
}

let removeUser= () => {
	localStorage.removeItem('access')
}

let removeToken= () => {
	document.cookie = `token_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	localStorage.removeItem('token_access')
	removeUser();
	window.location.href = '/';
}

let replaceParamsTo = (key:string, value:string) => {
	let url = (new URL(window.location.href));
	url.searchParams.set(key, value);
	return (url.search);
}

let getParamsPriv = () => {
	const params = (new URL(window.location.href)).searchParams;
	let code: Map<string, string> = new Map();
	let tmp = params.get("code");
	if (tmp){
		code.set("code", tmp);
		tmp = params.get("name");
		if (tmp){
			code.set("name", tmp);
		}
		tmp = params.get("Setting");
		if (tmp){
			code.set("setting", tmp);
		}
	}
	return (code);
}
let getParamsChanCreateOrChange = () => {
	const params = (new URL(window.location.href)).searchParams;
	let code: Map<string, string> = new Map();
	let tmp = params.get("code");
	if (tmp){
		code.set("code", tmp);
		tmp = params.get("name");
		if (tmp){
			code.set("name", tmp);
		}
		tmp = params.get("chanName")
		if (tmp){
			code.set("chanName", tmp);
		}
	}
	return (code);
}

let getParamsNotif = () => {
	const params = (new URL(window.location.href)).searchParams;
	let code: Map<string, string> = new Map();
	let tmp = params.get("notif");
	if (tmp){
		code.set("notif", tmp);
	}
	return (code);
}
let getParamsCode = () => {
	const params = (new URL(window.location.href)).searchParams;
	let code: Map<string, string> = new Map();
	let tmp = params.get("code");
	if (tmp){
		code.set("code", tmp);
	}
	return (code);
}

let isLogged = async() => {
	let token = localStorage.getItem('token_access')
	if (!!token){
		try {
			const response = await apiGet.getAccess();
			if (response.status === 200)
				return (true);
			else{
				return (false);
			}
		} catch (e) {
			console.log(e);
		}
	}
	return false;
}

let getToken = () => {
	let token= localStorage.getItem('token_access');
	if (token === null)
		return ("");
	return (token);

}

export const accountService = {
	saveToken, removeToken, isLogged, getToken, getParamsPriv, getParamsCode, replaceParamsTo,
	getParamsNotif, getParamsChanCreateOrChange
}

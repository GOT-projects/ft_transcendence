import { GOT } from "shared/types";

export function isLogin(login: string) {
	if (typeof login !== 'string')
		return 'Bad type of login';
	if (login.length < 2 || login.length > 11)
		return 'Bad length of login';
	const patt = /^(\w|-)+$/;
	if (!patt.test(login))
		return 'Login malformed';
	return true;
}

export function isUser(user: any) {
	if (
		typeof user.id !== 'number'
		|| typeof user.login !== 'string'
		|| typeof user.urlImg !== 'string'
		|| typeof user.wallet !== 'number'
		|| typeof user.email !== 'string'
		|| typeof user.isTwoFactorAuthenticationEnabled !== 'boolean'
		|| typeof user.color !== 'string'
	)
		return 'User malformed';
	const values = Object.values(GOT.EnumBall);
	if (!(values.includes(user.ball as unknown as GOT.EnumBall)))
		return 'User malformed';
	return true;
}

export function isNotifChoice(notif: any) {
	if (notif.user !== undefined) {
		const test = isUser(notif.user);
		if (typeof test === 'string')
			return test;
	}
	if (notif.channel !== undefined) {
		
	}
}
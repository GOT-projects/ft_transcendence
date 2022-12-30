import { GOT } from "shared/types";

export function isLogin(login: any) {
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
		typeof user?.id !== 'number'
		|| typeof user?.login !== 'string'
		|| typeof user?.urlImg !== 'string'
		|| typeof user?.wallet !== 'number'
		|| typeof user?.email !== 'string'
		|| typeof user?.isTwoFactorAuthenticationEnabled !== 'boolean'
		|| typeof user?.color !== 'string'
	)
		return 'User malformed';
	const values = Object.values(GOT.EnumBall);
	if (!(values.includes(user?.ball as unknown as GOT.EnumBall)))
		return 'User enumball malformed';
	return true;
}

export function isChanName(ChanName: any) {
	if (typeof ChanName !== 'string')
		return 'ChanName malformed';
	if (ChanName.length < 2 || ChanName.length > 11)
		return 'Bad length of ChanName';
	const patt = /^(\w|-)+$/;
	if (!patt.test(ChanName))
		return 'ChanName malformed';
	return true;
}

export function isPassword(password: any) {
	if (typeof password !== 'string' && password !== undefined)
		return 'Channel malformed';
	if (typeof password !== 'string') {
		if (password.length < 2)
			return 'Too short password';
	}
	return true;
}

export function isChannel(channel: any) {
	if (typeof channel?.password !== 'string' && channel?.password !== undefined)
		return 'Channel malformed';
	const test = isPassword(channel?.password);
	if (typeof test === 'string')
		return test;
	const values = Object.values(GOT.ChannelStatus);
	if (!(values.includes(channel.status as unknown as GOT.ChannelStatus)))
		return 'Channel enum status malformed';
	return true;
}

export function isNotifChoice(notif: any) {
	if (notif.user !== undefined) {
		const test = isUser(notif.user);
		if (typeof test === 'string')
			return test;
	}
	if (notif?.channel !== undefined) {
		const test = isChannel(notif?.channel);
		if (typeof test === 'string')
			return test;
	}
	if (typeof notif?.accept !== 'boolean')
		return 'Notif status malformed';
	return true;
}

export function isMessage(msg: any) {
	if (typeof msg !== 'string')
		return 'Not a mesage';
	if (msg.length > 512)
		return 'Message too long';
	return true;
}



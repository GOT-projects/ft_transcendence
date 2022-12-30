export interface NotifyInter{
	isOpen:boolean,
	message: string,
	type: any,
}

export interface NotifyInterUse{
	notify: NotifyInter,
	setNotify: any,
}

export const Severity = {
	error: "error",
	warning: "warning",
	info: "info",
	success: "success",
}

export const Port = {
    Server: process.env.WDS_SOCKET_PORT !== undefined ? parseInt(process.env.WDS_SOCKET_PORT) : 3000,
}

export const InfoServer = {
	HttpServer:"http://" +  window.location.hostname + `:${Port.Server}`,
	SocketServer:"http://" +  window.location.hostname + `:${Port.Server}`,
	server: window.location.hostname + `:${Port.Server}`,
	client: window.location.hostname,
}

export interface DataMesssage{
	id?:string;
	message?: string,
	from?: string,
}

export interface UserListPrivate{
	id: string,
	user:string,
	mute: boolean,
	block: boolean,
	active: boolean,
	data?:DataMesssage[],
}

export interface PageName{
	name:string,
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface UsersId{
	id: number,
	idIntra: number | null,
	login: string,
	urlImg: string,
	username: string,
	wallet: number,
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

import { io } from 'socket.io-client';

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

export const InfoServer = {
	HttpServer:"http://" +  window.location.hostname + ":3000",
	SocketServer:"http://" +  window.location.hostname + ":3001",
	server: window.location.hostname + ":3000",
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

export const SocketClient = {
    socket: io("http://localhost:3000"),
}

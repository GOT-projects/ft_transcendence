import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";


let emitGameJoinWaing = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
	socket.emit('server_join_waiting', {Authorization: accountService.getToken()});
}
let emitLeftWaiting = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
	socket.emit('server_left_waiting', {Authorization: accountService.getToken()});
}

let emitJoinDemand = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login :string) =>{
	socket.emit('server_join_demand', {Authorization: accountService.getToken(), login : login});
}
let emitJoinResp = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login :string, status:boolean) =>{
	socket.emit('server_join_response', {Authorization: accountService.getToken(), login : login, status: status});
}

let emitjoinSpec = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, codeParty:number) =>{
	socket.emit('server_join_spectator', {Authorization: accountService.getToken(), codeParty: codeParty});
}

let emit_change_pad = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>,padInfo:number) =>{
	socket.emit('server_change_pad', {Authorization: accountService.getToken(), padInfo: padInfo});
}

let emit_where_am_I = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, where: string) =>{
	socket.emit('server_where_am_I', {Authorization: accountService.getToken(), where: where});
}

let emit_custom = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, custom: GOT.CustomGame) =>{
	socket.emit('server_custom', {Authorization: accountService.getToken(), custom: custom});
}
export const emitGame = {
	emitGameJoinWaing, emitLeftWaiting, emitJoinDemand, emitJoinResp, emitjoinSpec, emit_change_pad, emit_where_am_I, emit_custom
}

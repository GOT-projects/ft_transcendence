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
export const emitGame = {
    emitGameJoinWaing, emitLeftWaiting, emitJoinDemand
}

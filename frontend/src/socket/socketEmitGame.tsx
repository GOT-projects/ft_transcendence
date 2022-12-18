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

export const emitGame = {
    emitGameJoinWaing, emitLeftWaiting
}

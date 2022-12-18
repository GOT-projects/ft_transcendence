import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GOT } from "../shared/types";


let emitGame = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
    // socket.emit('server_game', {Authorization: accountService.getToken()});
}

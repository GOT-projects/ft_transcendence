import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

let client_init = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_init');
}

let client_invite = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_invite');
}

let client_game_finish = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_game_finish');
}

let client_game_player = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_game_player');
}

let client_game_spec = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_game_spectator');
}

let client_game_points = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_game_points');
}
export const offSocketGame ={
    client_init, client_invite, client_game_finish, client_game_player, 
    client_game_spec, client_game_points
}

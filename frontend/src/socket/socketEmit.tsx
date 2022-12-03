import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { accountService } from "../services/account.service";

let emitProfil = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
    socket.emit('server_profil', {Authorization: accountService.getToken()});
}

let emitFriends = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
    socket.emit('server_friends', {Authorization: accountService.getToken()});
}

let emitDemandFriend = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, username: string) => {
    socket.emit('server_demand_friend', {Authorization: accountService.getToken(), login: username})
}

let emitChangeUsername = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, username: string) => {
    socket.emit('server_demand_friend', {Authorization: accountService.getToken(), username: username})
}

let emitLeaderboard = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.emit('server_leaderboard', {Authorization: accountService.getToken()})
}
export const emitSocket ={
    emitProfil, emitFriends, emitDemandFriend, emitChangeUsername, emitLeaderboard
}

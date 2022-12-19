import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InfoServer } from "../components/interfaces";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";
import { emitSocket } from "./socketEmit";

let error_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('error_client', (rep:any) => {
        console.log('error_client', rep);
        if (typeof rep === "string")
            setNotify({isOpen: true, message: `Error: ${rep}`, type:'error'});
    })
}

let warning_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('warning_client', (rep:any) => {
        console.log('warning_client', rep);
        if (typeof rep === "string")
            setNotify({isOpen: true, message: `Warning: ${rep}`, type:'warning'});
    })
}

let info_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('info_client', (rep:any) => {
        console.log('info_client', rep);
        if (typeof rep === "string"){
            let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
            if (regex.test(rep)){
                setNotify({isOpen: true, message: `${rep}`, type:'info'});
            }else{
                setNotify({isOpen: true, message: `Info: ${rep}`, type:'info'});
            }
        }
    })
}

let client_jwt = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.on('client_jwt', (rep:string) => {
        console.log("new jwt")
        if (rep){
            accountService.saveToken(rep);
        } 
    })
}

// game
let client_init = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, 
    setInitGame:React.Dispatch<React.SetStateAction<GOT.InitGame | undefined>>,
    setStartGame:React.Dispatch<React.SetStateAction<boolean>> ) => {
    socket.on('client_init_game', (rep:GOT.InitGame) => {
        console.log("client_init_game", rep)
        if (rep){
            setInitGame(rep);
            setStartGame(true)
        } 
    })
}

let client_invite = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setInviteRequest: React.Dispatch<React.SetStateAction<boolean>>) => {
    socket.on('client_invite', (rep:boolean) => {
        console.log("client_invite", rep)
        setInviteRequest(rep);
    })
}

let client_game_finish = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setEndGame: React.Dispatch<React.SetStateAction<boolean>>) => {
    socket.on('client_game_finish', (rep:boolean) => {
        console.log("client_game_finish", rep)
        setEndGame(rep);
    })
}

let client_game_player = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setPlayer: React.Dispatch<React.SetStateAction<GOT.ActuGamePlayer| undefined>>) => {
    socket.on('client_game_player', (rep:GOT.ActuGamePlayer) => {
        console.log("client_game_finish", rep)
        if (rep)
            setPlayer(rep);
    })
}

let client_game_spec = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setSpec: React.Dispatch<React.SetStateAction<GOT.ActuGameSpectator| undefined>>) => {
    socket.on('client_game_spectator', (rep:GOT.ActuGameSpectator) => {
        console.log("client_game_spectator", rep)
        if (rep)
            setSpec(rep);
    })
}

let client_game_points = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setPoints: React.Dispatch<React.SetStateAction<GOT.ActuGamePoints| undefined>>) => {
    socket.on('client_game_points', (rep:GOT.ActuGamePoints) => {
        console.log("client_game_points", rep)
        if (rep)
            setPoints(rep);
    })
}

export const onSocketGame = {
    info_client, warning_client, error_client, client_jwt, client_init, client_invite, 
    client_game_finish, client_game_player, client_game_spec, client_game_points
}

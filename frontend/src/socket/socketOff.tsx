import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";

let profil_login = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_profil_login');
}

let client_privmsg_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_privmsg_users');
}

let client_friends = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_friends');
}

let client_privmsg_send = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_privmsg_send');
}

let client_profil = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_profil');
}

let client_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_users');
}

let client_privmsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_privmsg');
}

let client_channelIn = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_channels_in');
}
let client_channel = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.off('client_channels');
}
export const offSocket ={
    profil_login, client_privmsg_users, client_friends, client_privmsg_send, client_profil, client_users, client_privmsg, client_channel, client_channelIn
}

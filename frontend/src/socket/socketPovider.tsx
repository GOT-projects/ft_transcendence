import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { InfoServer } from "../components/interfaces";


//init socket to server
export const socket = io(InfoServer.SocketServer ,{withCredentials:false, extraHeaders: {
    "Authorization": "bearer " + localStorage.getItem("token_access"),
}});

export const SocketContext = createContext(socket);

//create function for decorate route so will connect socket when you are on page

export const useSocket = () => useContext(SocketContext);

//init socket to server
export const socketGame = io(`${InfoServer.SocketServer}/game` ,{
    withCredentials:false, extraHeaders: {
    "Authorization": "bearer " + localStorage.getItem("token_access"),
}});

export const SocketContextGame = createContext(socketGame);

//create function for decorate route so will connect socket when you are on page

export const useSocketGame = () => useContext(SocketContextGame);


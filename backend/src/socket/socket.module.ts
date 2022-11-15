import { Module } from "@nestjs/common";
import { SocketEvents } from "./socketEvent";

@Module({
    providers: [SocketEvents],
})

export class SocketModule{}

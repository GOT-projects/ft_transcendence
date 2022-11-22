import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class GatewayService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async handleConnection(client: Socket, users: Map<string, string[]>) {
        
    }
}
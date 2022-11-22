import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class JWTGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpCtx = context.switchToHttp().getRequest();
        const authorizationHeader = httpCtx.headers?.authorization;
        // Not connected
        if (!authorizationHeader) {
            console.debug(httpCtx.headers);
            console.debug('User not allowed');
            throw new UnauthorizedException();
        }
        const auth : string[] = authorizationHeader.split(' ');
        if (auth.length !== 2) {
            console.debug('Bad format of header');
            throw new UnauthorizedException();
        }
        // Verify token
        const jwt = auth[1];
        try {
            const data = await this.jwtService.verifyAsync(jwt);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
}

@Injectable()
export class JWTGuardSocket implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socketCtx: Socket = context.switchToWs().getClient();
        const authorizationHeader = socketCtx.handshake.headers?.authorization;
        // Not connected
        if (!authorizationHeader) {
            console.debug(authorizationHeader);
            console.debug('User not allowed');
            throw new WsException('Unauthorized');
        }
        const auth : string[] = authorizationHeader.split(' ');
        if (auth.length !== 2) {
            console.debug('Bad format of header');
            throw new WsException('Unauthorized');
        }
        // Verify token
        const jwt = auth[1];
        try {
            const data = await this.jwtService.verifyAsync(jwt);
        } catch (error) {
            throw new WsException(error.message);
        }
        return true;
    }
}

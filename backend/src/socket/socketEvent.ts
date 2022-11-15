import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway({
    cors:{
        origine: '*',
    }
})

export class SocketEvents{
    @WebSocketServer()
    server: Server;
    //connexion see people connecte
    handleConnection(client: Socket){
        console.log("Client Connect: ", client.id);
        this.server.socketsJoin("test");
    }

    //disconnexion see people connecte
    handleDisConnect(client: Socket){
        console.log("Client Disconnect: ", client.id);
    }

    //recevoir un event decoration Sucrib
    @SubscribeMessage('message')
    handleEvent(@MessageBody() data: unknown){
        console.log("data Receive from Client", data);
    }
}

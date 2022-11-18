import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server} from 'socket.io'

//can add cors in param of WebSocketGateway and change port to
@WebSocketGateway({
    cors: {
        credentials: false,
        origin: "*"
    }
})
    export class Gateway implements OnModuleInit{
        @WebSocketServer()
        server: Server;
        users: Map<string, string> = new Map<string, string>();
        onModuleInit() {
            //get id of socket when is connect
            this.server.on('connection', (socket) => {
                //add in header from client id: <value>
                console.log(socket.request.headers.id, "\nConnected")
                if (socket.request.headers.id && typeof socket.request.headers.id === 'string' && socket.request.headers.id !== "null"){
                    this.users.set(socket.request.headers.id, socket.id);
                    console.log("add user to list")
                }
                console.log(this.users)
            })
        }

        //receive message
        @SubscribeMessage('newMessage')
        onNewMessage(@ConnectedSocket() client: Socket, @MessageBody() body: any){
            console.log(this.users);
            //emit the message to every socket connect
            //for emit to 1 socket can use to(socker id).emit()
            const tmp = this.users.get(body.sendto);
            console.log('tmp', tmp);
            if (!tmp)
                return ;//throw new WsException('Unauthorized');*/
            console.log('shit');
            this.server.to(tmp).emit('onMessage', {
                from: body.from,
                msg: body.msg, 
            });
        }

        //disconnection client
        handleDisconnect(client: any){
            console.log("disconnection: ", client.id, this.users)
            for (let [key, value] of this.users.entries()) {
                console.log("value for", key, value, client.id)
                    if (value === client.id)
                        this.users.delete(key);
            }
            console.log(this.users);
        }
    }

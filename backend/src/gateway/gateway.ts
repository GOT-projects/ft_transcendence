import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server} from 'socket.io'

//can add cors in param of WebSocketGateway and change port to
@WebSocketGateway()
    export class Gateway implements OnModuleInit{
        @WebSocketServer()
        server: Server;
        users:any = new Map<string, string>();
        onModuleInit() {
            //get id of socket when is connect
            this.server.on('connection', (socket) => {
                //add in header from client id: <value>
                console.log(socket.request.headers.id, "\nConnected")
                if (socket.request.headers.id && typeof socket.request.headers.id === 'string' ){
                    this.users.set(socket.request.headers.id, socket.id);
                    console.log("add user to list")
                }
            })
        }

        //receive message
        @SubscribeMessage('newMessage')
        onNewMessage(@MessageBody() body: any){
            console.log(body)
            console.log(body.sendto)
            console.log(this.users[body.sendto]);
            console.log(body.msg)
            //emit the message to every socket connect
            //for emit to 1 socket can use to(socker id).emit()
            this.server.to(this.users[body.sendto]).emit('onMessage', {
                msg: 'newMessage', 
                content: body.msg,
                })
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

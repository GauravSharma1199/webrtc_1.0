import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket : null | WebSocket = null;
let recieverSocket : null | WebSocket = null;

wss.on('connection', function connection(ws){
    ws.on('error', (err) => console.log(err))
    
    ws.on('message', function message(data: any){
      const message = JSON.parse(data);
      console.log('msg', message);

      if (message.type === 'sender') {
        senderSocket = ws;
        senderSocket.send(JSON.stringify({
          type: 'status',
          msg: "connected with web socket"
        }));
      }
      else if (message.type === 'reciever') {
        recieverSocket = ws;
        recieverSocket.send(JSON.stringify({
          type: 'status',
          msg: "connected with web socket"
        }));
      }

      else if (message.type === 'createOffer') {
        recieverSocket?.send(JSON.stringify(
          { type: 'createOffer' , sdp: message.sdp}
        ))
      }

      else if (message.type === 'createAnswer') {
        senderSocket?.send(JSON.stringify({
          type: 'createAnswer',
          sdp: message.sdp
        }))
      }

      else if (message.type === 'iceCandidate') {
        if (ws === senderSocket) {
          recieverSocket?.send(JSON.stringify({
            type: 'iceCandidate',
            candidate: message.candidate
          }))
        }
        else if (ws === recieverSocket) {
          senderSocket?.send(JSON.stringify({
            type: 'iceCandidate',
            candidate: message.candidate
          }))
        }
      }
      
    })


});
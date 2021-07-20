
//Montaje de Websocket en puerto 80
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 80 })

wss.on('connection', ws => {
  console.log('Nueva conexion websocket detectada');
  console.log(ws);
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    let comandos = message.split(',');
    console.log(comandos[0],comandos[1],comandos[2]);
    if(comandos[0]==='SEND'){
     console.log('Enviando datos:',comandos[2],'a dispositivo: ',comandos[1]);
     console.log(allSockets)
    }
    if(comandos[0]==='CHECK'){
     var s = allSockets[comandos[1]];
     console.log(s.readyState);
    }
    if(comandos[0]==='PING'){
     var s = allSockets[comandos[1]];
     s.write(comandos[2],(error,data)=>{
       console.log('Datos enviados');
       //console.log(error);
       //console.log(data);
     });
    }
    ws.send('Se ha recibido el mensaje')
  })
})

//Montaje de TCP/IP Socket en puerto 443
const net = require('net');
const server = net.createServer()
const tcpPort = 443;
var socketId = "";
var allSockets = {};
var socketcount = 1;

server.on('connection', (socket)=>{
    socket.on('data', (data)=>{
        console.log('\nEl cliente ' + socket.remoteAddress + ": " + socket.remotePort + "dice: " + data)
        const d = new Date();
        const dc = new Date(d.valueOf() - 21600000 + 3600000);
        var respuesta = 'PingPing ' + dc.toLocaleString();
        socket.write(respuesta);
    })

    socket.on('close', ()=>{
        console.log('Comunicación finalizada')
    })

    socket.on('error', (err)=>{
        console.log(err.message)
    })
    socket.id = Math.floor(Math.random() * 1000);
    console.log( typeof(socket._handle));
    socketId = socket._handle.fd;
    console.log(socketId);
    console.log(socket);
    allSockets[String(socketcount)]=socket;
    socketcount = socketcount + 1;
    // console.log(socket._handle.fd);
})

server.listen(tcpPort, ()=>{
    console.log('servidor esta escuchando en la puerta', server.address().port)
})

//setInterval(myTimer, 22000);

function myTimer() {
  server.getConnections(function(error,count){
    console.log('Number of concurrent connections to the server : ' + count);
  });
  const d = new Date();
  console.log(d);
  console.log('Ultimo socket añadido: ',socketId);
  console.log('Enviando PING remoto....');
  const socketT = new net.Socket(socketId);
  socketT.write('Inter Ping',(error,data)=>{
   console.log('Datos enviados');
   //console.log(error);
   //console.log(data);
  });
}

const db = require("../models");
const Developer =db.user;
const Chat =db.message;
const  jwt = require('jsonwebtoken');
const ws = require('ws');
const fs = require('fs');
const config = require("../config/auth.config");
const User=db.user;

const { JWT_SECRET } = process.env;

async function websocket (server) {
    console.log(`Hello, !`);
    const verifyToken = (token, secret) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return reject(new Error('Token expired, please login again'));
                }
                resolve(decoded);
            });
        });
    };

    var wss = new ws.WebSocketServer({server});
    wss.on('connection',async function (connection,req) {

        console.log("samson coming");
        function notifyAboutOnlinePeople(){
            console.log([...wss.clients].map(c => c.userdetails.email ));
            [...wss.clients]
                .forEach(client => {
                    client.send(JSON.stringify({
                            online: [...wss.clients].map(c => c.userdetails)
                        }
                    ));
                });
        }

        console.log("moving");
        connection.isAlive = true;
        connection.timer = setInterval(()=>{
            connection.ping();
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false;
                clearInterval();
                connection.terminate();
                notifyAboutOnlinePeople();
                console.log("dead");
            },1000)
        }, 5000);

        console.log("continue");
        connection.on('pong', () => {
            clearTimeout(connection.deathTimer);
            console.log('pong');
        });

        const token = new URLSearchParams(req.url.split('?')[1]).get('token');
        console.log(token);
        // const decode = jwt.verify(token, config.secret);
        // if (err) {
        //     return res.status(401).json({ message: 'Token expired, please login again' });
        // }


        console.log(verifyToken(token, config.secret));
        const decoded = await verifyToken(token, config.secret)
        const userId = decoded.id;

        connection.userdetails = await User.findOne({ where: { id: userId } });
        // connection.userdetails = await Developer.findOne({id: decode.id}, {$set: {online_status: 1}});
        console.log(connection);
        connection.on('message', async (message) => {
            console.log(message);
            const messageData = JSON.parse(message);
            const{event, data} = messageData;
            if(event === "message" ){
                await messages(connection, data);


            }else if(event === "typing" ){
                await typing(connection, data);
            }
        });

        notifyAboutOnlinePeople();
    });

    wss.on('close', data => {
        console.log('disconnect', data);
    });


    async function messages(connection,messageData){

        const{recipient, text, file} = messageData;
        let filename = null;
        if (file) {
            const parts = file.name.split('.');
            const ext = parts[parts.length - 1];
            filename = Date.now() + "." + ext;
            const path = __dirname + '/public/chat/' + filename;
            const bufferData = new Buffer(file.data.split(',')[1], 'base64');
            fs.writeFile(path, bufferData, () => {
                console.log('file saved: ' + path);
            })
        }
        console.log(connection.userdetails);
        if(recipient && text) {
            const messageDoc = await Chat.create({
                senderId: connection.userdetails.id,
                recipientId: recipient,
                content: text,
                // file: file? filename : null
            });
            [...wss.clients]
                .filter(c => c.userdetails.id === recipient)
                .forEach(c => c.send(JSON.stringify({
                    "event": "message",
                    "data": messageDoc
                })));
        }
    }
    async function typing(connection,messageData){

        const{recipient} = messageData;
        if(recipient) {
            [...wss.clients]
                .filter(c => c.userdetails.id === recipient)
                .forEach(c => c.send(JSON.stringify({
                    "event": "typing",
                    "data": {
                        "sender_id": connection.userdetails.id,
                        "receiver_id": recipient,
                    }
                })));
        }
    }
}

module.exports = websocket;







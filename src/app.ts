
import {createServer} from "node:http";
import {addUser, getAllUsers, User} from "./model/users.js";
import {parsBody} from "./tools.js";



const myServer = createServer(async (req, res) => {
    const {url, method} = req;
    //(/api/usersGET
    switch (url! + method) {
        case "/api/users" + "GET" : {
            const users = getAllUsers();
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(users));
            break;
        }
        case "/api/users" + "POST" : {
            const body = await parsBody(req);
            //must be validation
            const result = addUser(body as User);
            if(result){
                res.writeHead(201, {"Content-Type": "text/plain"})
                res.end("User successfully added")
            }
            else{
                res.writeHead(409, {"Content-Type": "text/plain"})
                res.end("User already exists")
            }
            break;
        }
        default:{
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end("Not found")
        }

    }
});

myServer.listen(3055, () => {
    console.log("Server runs at http://localhost:3055")
})
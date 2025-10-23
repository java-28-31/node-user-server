
import {createServer} from "node:http";
import {addUser, deleteUser, getAllUsers, getUserById, updateUser, User} from "./model/users.js";
import {parsBody} from "./tools.js";



const myServer = createServer(async (req, res) => {
    const {url, method} = req;
    const urlObj = new URL(url!, `http://${req.headers.host}`);
    const params = urlObj.searchParams;

    //(/api/usersGET
    switch (urlObj.pathname + method) {
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
        case "/api/users" + "DELETE": {
            const id = params.get('userId');
            if(!id){
                res.writeHead(400, {"Content-Type": "text/plain"})
                res.end("No params found");
            }
            else{
                const result = deleteUser(+id);
                if(!result){
                    res.writeHead(404, {"Content-Type": "text/plain"})
                    res.end(`User with id ${id} not found`)
                }
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
            }
            break;
        }
        case "/api/user" + "GET": {
            const id = params.get('userId');
            if(!id){
                res.writeHead(400, {"Content-Type": "text/plain"})
                res.end("No params found");
            }
            else{
                const result = getUserById(+id);
                if(!result){
                    res.writeHead(404, {"Content-Type": "text/plain"})
                    res.end(`User with id ${id} not found`)
                }
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
            }
            break;
        }
        case "/api/user" + "PATCH": {
            const id = params.get('userId');
            const newName = params.get('newName');
            if(!id || !newName){
                res.writeHead(400, {"Content-Type": "text/plain"})
                res.end("No params found");
            }
            else{
                const result = updateUser(+id, newName);
                if(!result){
                    res.writeHead(404, {"Content-Type": "text/plain"})
                    res.end(`User with id ${id} not found`)
                }
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "node:http";
import { addUser, deleteUser, getAllUsers, getUserById, updateUser } from "./model/users.js";
import { parsBody } from "./tools.js";
import { myLogger } from "./events/logger.js";
// http://localhost:3000/api/user/{:id}/{:name}/{:eyeColor}
// /http:/localhost:3000/api/user?id=345&name=Slava&eyeColor=gray
const myServer = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, method } = req;
    const urlObj = new URL(url, `http://${req.headers.host}`);
    myLogger.log('Server got the request ' + method + urlObj.pathname);
    const params = urlObj.searchParams;
    //(/api/usersGET
    switch (urlObj.pathname + method) {
        case "/api/users" + "GET": {
            const users = getAllUsers();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
            myLogger.log('All users responsed');
            break;
        }
        case "/api/users" + "POST": {
            let body;
            try {
                body = (yield parsBody(req));
            }
            catch (e) {
                myLogger.toFile("Unexpected error in service.addUser - wrong argument " + e.message);
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Unexpected error " + e.message);
                break;
            }
            const result = addUser(body);
            if (result) {
                // emitter.emit('user_added');
                myLogger.toFile(`User with id ${body.id} was successfully added`);
                res.writeHead(201, { "Content-Type": "text/plain" });
                res.end("User successfully added");
            }
            else {
                myLogger.log(`User with id ${body.id} already exists`);
                res.writeHead(409, { "Content-Type": "text/plain" });
                res.end("User already exists");
            }
            break;
        }
        case "/api/users" + "DELETE": {
            const id = params.get('userId');
            if (!id) {
            }
            else {
                const result = deleteUser(+id);
                if (!result) {
                    myLogger.log(`User with id ${id} not found`);
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end(`User with id ${id} not found`);
                }
                else {
                    // emitter.emit('user_removed');
                    myLogger.toFile(`User with id ${id} deleted`);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                }
            }
            break;
        }
        case "/api/user" + "GET": {
            const id = params.get('userId');
            if (!id) {
                myLogger.log("No params found");
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("No params found");
            }
            else {
                const result = getUserById(+id);
                if (!result) {
                    myLogger.save(`User with id ${id} not found`);
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end(`User with id ${id} not found`);
                }
                else {
                    myLogger.save(`User with id ${id} sent with response`);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                }
            }
            break;
        }
        case "/api/user" + "PATCH": {
            const id = params.get('userId');
            const newName = params.get('newName');
            if (!id || !newName) {
                myLogger.save("No params found");
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("No params found");
            }
            else {
                const result = updateUser(+id, newName);
                if (!result) {
                    myLogger.save(`User with id ${id} not found`);
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end(`User with id ${id} not found`);
                }
                else {
                    myLogger.toFile(`User with id ${id} was updated as ${result}`);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                }
            }
            break;
        }
        case '/logger' + 'GET': {
            const allLogs = myLogger.getLogArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(allLogs));
            break;
        }
        default: {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
        }
    }
}));
myServer.listen(3055, () => {
    console.log("Server runs at http://localhost:3055");
    myLogger.toFile('Server started');
});
//==================Stopping server==================
process.on('SIGINT', shutdown); //server stopped by Ctrl+C
process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);
function shutdown() {
    myLogger.serverStop("Server shutdown....");
    myServer.close(() => {
        myLogger.serverStop("All connections closed");
        process.exit(0);
    });
}
function handleFatalError(err) {
    if (err instanceof Error) {
        myLogger.serverStop("Server failed by fatal error \n" + err.message + "\n" + err.stack);
    }
    else {
        myLogger.serverStop("Server failed by fatal error \n" + err);
    }
    myServer.close(() => process.exit(1));
}

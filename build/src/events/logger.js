import { EventEmitter } from "node:events";
import * as fs from "node:fs";
class Logger extends EventEmitter {
    constructor() {
        super(...arguments);
        this.logArray = [];
    }
    addLogToArray(message) {
        this.logArray.push({ date: new Date().toISOString(), message });
    }
    getLogArray() {
        return [...this.logArray];
    }
    log(message) {
        this.emit('logged', message);
    }
    save(message) {
        this.emit('saved', message);
    }
    toFile(message) {
        this.emit('to_file', message);
    }
    serverStop(message) {
        this.emit('stop', message);
    }
}
export const myLogger = new Logger();
myLogger.on('logged', (message) => {
    console.log(new Date().toISOString(), message);
});
myLogger.on('saved', (message) => {
    myLogger.addLogToArray(message);
    myLogger.log(message);
});
myLogger.on('to_file', (message) => {
    let fileName = new Date().toDateString() + ".log";
    fs.writeFile(fileName, JSON.stringify({ date: new Date().toISOString(), message }) + "\n", { encoding: 'utf-8', flag: 'a' }, (err) => { if (err)
        console.log(err.message); });
    myLogger.addLogToArray(message);
    myLogger.log(message);
});
myLogger.on('stop', (message) => {
    let fileName = new Date().toDateString() + ".log";
    fs.writeFileSync(fileName, JSON.stringify({ date: new Date().toISOString(), message }) + "\n", { encoding: 'utf-8', flag: 'a' });
    myLogger.log(message);
});

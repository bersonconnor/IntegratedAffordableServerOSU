"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// We must initialize the database before loading in the routes
const DatabaseConnection_1 = __importDefault(require("./database/DatabaseConnection"));
DatabaseConnection_1.default.initializeDatabaseConnection()
    .then(() => { console.log("Database connection established"); })
    .catch(e => { console.log("Error initializing database"); throw e; });
/**
 * Module dependencies.
 */
const app_1 = __importDefault(require("./app"));
const Debug = __importStar(require("debug"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
// Read server/.env
const dotenv_1 = require('dotenv');
dotenv_1.config();
const debug = Debug.debug("server:server");
//Normalize a port into a number, string, or false.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Get port from environment and store in Express.
 */
const PORT = normalizePort(process.env.PORT || "4000");
app_1.default.set("port", PORT);
/**
 * Create server, HTTP or HTTPS style depending on ENABLE_HTTPS environmental variable in server/.env
 */
var server;
if (process.env.ENABLE_HTTPS == "true") {
    // Load HTTPS certs
    const options = {
        key: fs_1.default.readFileSync('./private.key', 'utf8'),
        cert: fs_1.default.readFileSync('./certificate.crt', 'utf8'),
        ca: fs_1.default.readFileSync('./ca_bundle.crt', 'utf8')
    };
    // Start server with HTTPS certs
    server = https_1.default.createServer(options, app_1.default);
}
else {
    server = http_1.default.createServer(app_1.default);
}
//Event listener for server "error" event.
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
//Event listener for server "listening" event.
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
    if (process.env.ENABLE_HTTPS == "true") {
        console.log("🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒");
        console.log("🔒🔒 HTTPS enabled  🔒🔒");
        console.log("🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒🔒");
    }
    else {
        console.log("WARNING: HTTPS disabled");
    }
}
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT);
server.on("error", onError);
server.on("listening", onListening);
console.log("Back-end is up and running!");
console.log(`Listening on Port Number ${PORT}!\n`);
/**
 * Graceful shutdown of server.
 */
process.on("SIGINT", () => {
    console.log("\nSIGINT signal received.");
    console.log("Closing server.");
    server.close(() => {
        console.log("Server closed.");
    });
});

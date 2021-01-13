// We must initialize the database before loading in the routes
import DatabaseConnection from "./database/DatabaseConnection";

DatabaseConnection.initializeDatabaseConnection()
	.then(() => { console.log("Database connection established"); })
	.catch(e => { console.log("Error initializing database"); throw e; });


/**
 * Module dependencies.
 */
import app from "./app";
import * as Debug from "debug";
import http from "http";
import https from "https";
import fs from "fs";

// Read server/.env
const dotenv_1=require('dotenv');
dotenv_1.config();

const debug = Debug.debug("server:server");

//Normalize a port into a number, string, or false.
function normalizePort(val): number | string | false {
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
app.set("port", PORT);

/**
 * Create server, HTTP or HTTPS style depending on ENABLE_HTTPS environmental variable in server/.env
 */
var server;

if (process.env.ENABLE_HTTPS == "true") {
    // Load HTTPS certs
    const options = {
        key: fs.readFileSync('./private.key', 'utf8'),
        cert: fs.readFileSync('./certificate.crt', 'utf8'),
        ca: fs.readFileSync('./ca_bundle.crt', 'utf8')
    };
    // Start server with HTTPS certs
    server = https.createServer(options, app);
}
else {
    server = http.createServer(app);
}

//Event listener for server "error" event.
function onError(error): void {
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
function onListening(): void {
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

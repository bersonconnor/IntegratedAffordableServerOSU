import DatabaseConnection from "../database/DatabaseConnection";
import { IllegalArgumentError } from "../models/IllegalArgumentError";
import { NotFoundError } from "../models/NotFoundError";
import { UnauthorizedError } from "../models/UnauthorizedError";
import { UnauthenticatedError } from "../models/UnauthenticatedError";

export function errorHandler(err, req, res, next): void {
    // Expected errors always throw Error.
    if (Object.prototype.isPrototypeOf.call(IllegalArgumentError.prototype, err)) {
        return res.status(err.status || 400).json({ error: err.message });
    }

    if (Object.prototype.isPrototypeOf.call(NotFoundError.prototype, err)) {
        return res.status(err.status || 404).json({ error: err.message });
    }

    if (Object.prototype.isPrototypeOf.call(UnauthorizedError.prototype, err)) {
        return res.status(err.status || 401).json({ error: err.message });
    }

    if (Object.prototype.isPrototypeOf.call(UnauthenticatedError.prototype, err)) {
        return res.status(err.status || 401).json({ error: err.message });
    }

    // Unexpected errors will either throw unexpected stuff or crash the application.
    if (Object.prototype.isPrototypeOf.call(Error.prototype, err)) {
        console.log(err);
        return res.status(err.status || 500).json({ error: err.message });
    }

    console.error("~~~ Unexpected error exception start ~~~");
    console.error(req);
    console.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        DatabaseConnection.initializeDatabaseConnection()
            .then(() => {
                console.log("Database connection re-established");
            })
            .catch(e => {
                console.log("Error initializing database");
                throw e;
            });
    }
    console.error("~~~ Unexpected error exception end ~~~");
    return res.status(500).json({ error: "Unknown Internal Server Error" });
}
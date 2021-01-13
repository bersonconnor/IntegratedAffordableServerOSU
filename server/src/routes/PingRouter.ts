import { errorHandler } from "./ErrorHandler";
import DatabaseConnection from "../database/DatabaseConnection";

const pingRouter = require('express').Router();

pingRouter.use("/", returnPing)
pingRouter.use(errorHandler);

function returnPing(req, res) {
    let status = DatabaseConnection.getConnectionStatus();
    if (status) {
        res.status(200).send()
    } else {
        res.status(500).send()
    }
}

export default pingRouter;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInfoService = void 0;
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const connectionPool = DatabaseConnection_1.default.getInstance();
class GetInfoService {
    constructor() {
        this.getUserID = async (req, res) => {
            const sqlGetID = 'SELECT ID FROM AuthenticationInformation WHERE Username=\'' + req.body.username + '\';';
            await connectionPool.query(sqlGetID, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    res.status(200).json({ 'status': 'OK', 'userID': results[0].ID });
                }
            });
        };
        this.getOrgID = async (req, res) => {
            const sqlGetID = 'SELECT ID FROM Organization WHERE name=\'' + req.body.orgName + '\';';
            await connectionPool.query(sqlGetID, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    res.status(200).json({ 'status': 'OK', 'orgID': results[0].ID });
                }
            });
        };
        this.getGrantID = async (req, res) => {
            const sqlGetID = 'SELECT ID FROM Grants WHERE grantName=\'' + req.body.hugName + '\';';
            console.log("Hug Name");
            console.log(req.body.hugName);
            await connectionPool.query(sqlGetID, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    res.status(200).json({ 'status': 'OK', 'grantID': results[0].ID });
                }
            });
        };
    }
}
exports.GetInfoService = GetInfoService;

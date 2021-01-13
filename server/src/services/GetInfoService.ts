import db from "../database/DatabaseConnection";
const connectionPool = db.getInstance()

export class GetInfoService {
    public getUserID = async (req, res) => {
        const sqlGetID = 'SELECT ID FROM AuthenticationInformation WHERE Username=\'' + req.body.username + '\';';

        await connectionPool.query(sqlGetID, (error, results) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({ 'status': 'OK', 'userID': results[0].ID });
            }
        });
    }

    public getOrgID = async (req, res) => {
        const sqlGetID = 'SELECT ID FROM Organization WHERE name=\'' + req.body.orgName + '\';';
        await connectionPool.query(sqlGetID, (error, results) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({ 'status': 'OK', 'orgID': results[0].ID });
            }
        });
    }

    public getGrantID = async (req, res) => {
        const sqlGetID = 'SELECT ID FROM Grants WHERE grantName=\'' + req.body.hugName + '\';';
        console.log("Hug Name");
        console.log(req.body.hugName);
        await connectionPool.query(sqlGetID, (error, results) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({ 'status': 'OK', 'grantID': results[0].ID });
            }
        });
    }
}
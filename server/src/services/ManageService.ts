import db from "../database/DatabaseConnection";
const connectionPool = db.getInstance()

export class ManageService {

    public queryHUG = async (req, res) => {
        //Only name of grant given
        console.log("in query HUG");
        if (req.body.orgID != null && req.body.orgID != "") {
            const sqlGrant = 'SELECT * FROM Grants WHERE organizationId=' + req.body.orgID + ';';

            await connectionPool.query(sqlGrant, async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                } else {
                    console.log('Query by orgID Complete')
                    const grantIDs = this.getGrantIDs(results);
                    if (grantIDs.length == 0) {
                        res.status(200).json({ 'status': 'OK', 'grants': 'None' });
                    }
                    else {
                        res.status(200).json({ 'status:': 'OK', 'grants': results, 'IDs': grantIDs });
                    }
                }
            });
        }

    }

    public queryDonates = async (req, res) => {
        //Only name of grant given
        console.log("in donates");
        console.log("the value of grantID", req.query.grantID)
        if (req.query.grantID != null && req.query.grantID != "") {
            const sqlGrant = 'SELECT * FROM Donates WHERE grantID=' + req.query.grantID + ';';

            await connectionPool.query(sqlGrant, async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                } else {
                    console.log('Query by grantID Complete')
                    console.log(results.length)
                    const numPeople = results.length.toString();
                    res.status(200).json({ 'status': 'OK', 'donates': numPeople });
                }
            });
        }

    }

    //Helper Method
    private getGrantIDs(results) {
        const grantIds = [];
        //Get all Grant IDs to reference GrantEligibility table
        for (let i = 0; i < results.length; i++) {
            grantIds.push(results[i].ID);
        }
        return JSON.stringify(grantIds);
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepresentOrganizationService = void 0;
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const connectionPool = DatabaseConnection_1.default.getInstance();
class RepresentOrganizationService {
    constructor() {
        this.addMember = async (req, res) => {
            console.log("Adding Member");
            console.log(req.body.orgID);
            const sqlMember = 'INSERT INTO OrgMembers(orgID, donorID) VALUES ?';
            const memberValues = [
                [
                    req.body.orgID,
                    req.body.userID
                ]
            ];
            //Perform query
            connectionPool.query(sqlMember, [memberValues], (error) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Member Records inserted');
                    res.status(200).json({ 'status': 'OK' });
                }
            });
        };
        this.getAffiliations = async (req, res) => {
            const orgIDs = [];
            const orgsInfo = [];
            const sqlOrgMembers = 'SELECT * FROM OrgMembers WHERE donorID=\'' + req.body.userID + '\' ';
            await connectionPool.query(sqlOrgMembers, async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    var i;
                    for (i = 0; i < results.length; i++) {
                        orgIDs.push(results[i].orgID);
                        orgsInfo.push({ orgID: results[i].orgID, name: '', verified: true, role: results[i].admin ? "Admin" : "Member", date: results[i].membershipStartDate });
                    }
                }
                if (orgIDs.length > 0) {
                    let sqlOrgs = 'SELECT * FROM Organization WHERE';
                    var i;
                    for (i = 0; i < orgIDs.length; i++) {
                        sqlOrgs = sqlOrgs + ' ID=\'' + orgIDs[i] + '\'';
                        if (i != orgIDs.length - 1) {
                            sqlOrgs = sqlOrgs + ' or';
                        }
                    }
                    await connectionPool.query(sqlOrgs, async (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(502).json({ error });
                        }
                        else {
                            let j;
                            let k;
                            for (j = 0; j < results.length; j++) {
                                for (k = 0; k < orgsInfo.length; k++) {
                                    if (results[j].ID === orgsInfo[k].orgID) {
                                        orgsInfo[k].name = results[j].name;
                                        orgsInfo[k].verified = results[j].verified;
                                    }
                                }
                            }
                            res.status(200).json(orgsInfo);
                        }
                    });
                }
                else {
                    res.status(200).json({ 'status': 'OK', 'orgs': 'None' });
                }
            });
        };
    }
}
exports.RepresentOrganizationService = RepresentOrganizationService;

import {DBOOrganizationMembershipDAOImpl} from "../database/dao/organization/DBOOrganizationMembershipDAOImpl";
import db from "../database/DatabaseConnection";
import {OrganizationMembershipDBO} from "../models/orm/OrganizationMembershipDBO";
import {AddMemberRequest} from "affordable-shared-models";

const connectionPool = db.getInstance();


export class JoinGroupService {
    private organizationMembershipDao: DBOOrganizationMembershipDAOImpl;

    // TODO: Consider DI
    public constructor() {
        this.organizationMembershipDao = new DBOOrganizationMembershipDAOImpl();
    }

    public searchOrg = async (req, res) => {
        console.log("Searching Organization");
        console.log(req.body.orgName);
        const sqlGetOrg = 'SELECT * FROM Organization WHERE name LIKE \'%' + req.body.orgName + '%\';';
        await connectionPool.query(sqlGetOrg, (error, results) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                console.log(results);
                res.status(200).json({ 'status': 'OK', 'orgName': results });
            }
        });
    }

    public async addUserToOrganization(req: AddMemberRequest) {
        console.log("Adding Member");
        console.log(req.organizationId);

        const membershipRequest = new OrganizationMembershipDBO();
        membershipRequest.donorId = req.userId;
        membershipRequest.organizationId = req.organizationId;
        membershipRequest.isAdmin = req.isAdmin;
        membershipRequest.membershipStartDate = new Date();

        return this.organizationMembershipDao.saveMembership(membershipRequest);
    }

    public getAffiliations = async (req, res) => {
        const orgIDs = [];
        const orgsInfo =
            [
            ];
        const orgMemberships = await this.organizationMembershipDao.getAllMembershipsOfUser(req.body.userID) as any;
        orgMemberships.forEach(membership => {
            orgIDs.push(membership.id);
            orgsInfo.push({ orgID: membership.id, name: membership.name, verified: membership.verified, role: membership.isAdmin ? "Admin" : "Member", date: membership.membershipStartDate })
        })

        res.status(200).json(orgsInfo);
    }

    public removeMember = async (req, res) => {
        const sqlOrgMembers = 'DELETE FROM OrgMembers WHERE donorID=\'' + req.body.userID + '\' AND orgID=\'' + req.body.orgID + '\'  ';

        connectionPool.query(sqlOrgMembers, (error) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            }
        });

        if (req.body.admin === '1') {
            const sqlOrgLoc = 'DELETE FROM OrgLocations WHERE orgID=\'' + req.body.orgID + '\'';
            await connectionPool.query(sqlOrgLoc, (error) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Deleted from OrgLocations table')
                }
            });

            const sqlServ = 'DELETE FROM Services WHERE orgID=\'' + req.body.orgID + '\'';
            await connectionPool.query(sqlServ, (error) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Deleted from Services table')
                }
            });

            const sqlAcc = 'DELETE FROM AccountInfo WHERE orgID=\'' + req.body.orgID + '\'';
            await connectionPool.query(sqlAcc, (error) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Deleted from AccountInfo table')
                }
            });

            const sqlOrg = 'DELETE FROM Organization WHERE ID=\'' + req.body.orgID + '\'';
            await connectionPool.query(sqlOrg, (error) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Deleted from Organization table')
                    res.status(200).json({ 'status': 'OK' });
                }
            });
        }
        else {
            res.status(200).json({ 'status': 'OK' });
        }
    }

}
import uuidv4 from "uuid/v4";
import DatabaseConnection from "../../DatabaseConnection";
import { NotFoundError } from "../../../models/NotFoundError";
import { AdminPrivilegesDBO } from "../../../models/orm/profile/AdminPrivilegesDBO";
import { AdminPrivilegesDAO } from "./AdminPrivilegesDAO";
import { AuthenticationInformationDBO } from "../../../models/orm/AuthenticationInformationDBO";
import { DBOAuthenticationInformationDAOImpl } from "../authentication/DBOAuthenticationInformationDAOImpl";

let authDao: DBOAuthenticationInformationDAOImpl;
let adminDao: AdminPrivilegesDAO;

describe("AdminPrivilegesDAO tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection.initializeDatabaseConnection();
        adminDao = new AdminPrivilegesDAO();
        done();
    });

    test("CRUD", async () => {
        //unsure about constructor here...
        const user = new AuthenticationInformationDBO();
        const admin = new AdminPrivilegesDBO(user.id);

        let getAllAdmin: Array<AdminPrivilegesDBO> = await adminDao.getAdmins();
        const getAdmin = await adminDao.getAdmins();
        expect(getAdmin).toStrictEqual(getAllAdmin);

        //createAdmin
        const createdAdmin = await adminDao.createAdminPrivileges(admin);
        admin.userid = createdAdmin.userid;
        expect(createdAdmin).toBe(admin);

        //getAdmin by userid
        const getAdminById = await adminDao.getAdminPrivileges(createdAdmin.userid);
        expect(getAdminById).toStrictEqual(createdAdmin);

        //updateAdmin
        const updatedAdmin = await adminDao.updateAdminPrivileges(createdAdmin);
        expect(updatedAdmin).toStrictEqual(createdAdmin);

        //query for all the not-approved registration request
        let allNotApprovedAdmin: Array<AdminPrivilegesDBO> = await adminDao.getNotApprovedRegistration();
        const notApprovedAdmin = await adminDao.getNotApprovedRegistration();
        expect(notApprovedAdmin).toStrictEqual(allNotApprovedAdmin);

        //update the active field in the database for an admin user
        const result = true;
        const setActive = await adminDao.setAdminActive(createdAdmin.userid);
        expect(setActive).toStrictEqual(result);
    });

    afterAll(async () => {
        await authDao.deleteAllUsers();
    });

});
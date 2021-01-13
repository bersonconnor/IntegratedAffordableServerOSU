"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("../../DatabaseConnection"));
const AdminPrivilegesDBO_1 = require("../../../models/orm/profile/AdminPrivilegesDBO");
const AdminPrivilegesDAO_1 = require("./AdminPrivilegesDAO");
const AuthenticationInformationDBO_1 = require("../../../models/orm/AuthenticationInformationDBO");
let authDao;
let adminDao;
describe("AdminPrivilegesDAO tests", () => {
    beforeAll(async (done) => {
        await DatabaseConnection_1.default.initializeDatabaseConnection();
        adminDao = new AdminPrivilegesDAO_1.AdminPrivilegesDAO();
        done();
    });
    test("CRUD", async () => {
        //unsure about constructor here...
        const user = new AuthenticationInformationDBO_1.AuthenticationInformationDBO();
        const admin = new AdminPrivilegesDBO_1.AdminPrivilegesDBO(user.id);
        let getAllAdmin = await adminDao.getAdmins();
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
        let allNotApprovedAdmin = await adminDao.getNotApprovedRegistration();
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

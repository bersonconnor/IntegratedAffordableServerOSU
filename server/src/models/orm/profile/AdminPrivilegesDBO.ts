import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AdminPrivileges } from "affordable-shared-models";

@Entity({ name: "AdminPrivileges" })
export class AdminPrivilegesDBO {

    constructor(userId: number) {
        this.userid = userId;
        this.active = false;
        this.allowRejectAdminRegistration = false;
        this.revokeAdminAccess = false;
        this.setPrivileges = false;
        this.resetAuthInfoAdmin = false;
        this.resetAuthInfoNonAdmin = false;
        this.managePaymentTransactions = false;
        this.messageUserEmailUser = false;
        this.verifyOrgStatus = false;
        this.deactivateUsers = false;
        this.createRemoveHugs = false;
        this.createRemoveOrgs = false;
        this.editApplications = false;
        this.readAuditTrail = false;
    }

    @PrimaryColumn()
    userid: number;

    @Column({ name: "Active" })
    active: boolean;

    @Column({ name: "AllowRejectAdminRegistration" })
    allowRejectAdminRegistration: boolean;

    @Column({ name: "RevokeAdminAccess" })
    revokeAdminAccess: boolean;

    @Column({ name: "SetPrivileges" })
    setPrivileges: boolean;

    @Column({ name: "ResetAuthInfoNonAdmin" })
    resetAuthInfoNonAdmin: boolean;

    @Column({ name: "ResetAuthInfoAdmin" })
    resetAuthInfoAdmin: boolean;

    @Column({ name: "ManagePaymentTransactions" })
    managePaymentTransactions: boolean;

    @Column({ name: "MessageUserEmailUser" })
    messageUserEmailUser: boolean;

    @Column({ name: "VerifyOrg501c3Status" })
    verifyOrgStatus: boolean;

    @Column({ name: "DeactivateUsers" })
    deactivateUsers: boolean;

    @Column({ name: "CreateRemoveHugs" })
    createRemoveHugs: boolean;

    @Column({ name: "CreateRemoveOrgs" })
    createRemoveOrgs: boolean;

    @Column({ name: "EditApplications" })
    editApplications: boolean;

    @Column({ name: "ReadAuditTrail" })
    readAuditTrail: boolean;

    public static fromAdminPrivileges(admin: AdminPrivileges): AdminPrivilegesDBO {
        return {
            active: true,
            userid: admin.userid,
            allowRejectAdminRegistration: admin.allowRejectAdminRegistration,
            revokeAdminAccess: admin.revokeAdminAccess,
            setPrivileges: admin.setPrivileges,
            resetAuthInfoAdmin: admin.resetAuthInfoAdmin,
            resetAuthInfoNonAdmin: admin.resetAuthInfoNonAdmin,
            managePaymentTransactions: admin.managePaymentTransactions,
            messageUserEmailUser: admin.messageUserEmailUser,
            verifyOrgStatus: admin.verifyOrgStatus,
            deactivateUsers: admin.deactivateUsers,
            createRemoveHugs: admin.createRemoveHugs,
            createRemoveOrgs: admin.createRemoveOrgs,
            editApplications: admin.editApplications,
            readAuditTrail: admin.readAuditTrail
        };
    }

    public static toAdminPrivileges(admin: AdminPrivilegesDBO, username): AdminPrivileges {
        return {
            userid: admin.userid,
            username: username,
            allowRejectAdminRegistration: admin.allowRejectAdminRegistration,
            revokeAdminAccess: admin.revokeAdminAccess,
            setPrivileges: admin.setPrivileges,
            resetAuthInfoAdmin: admin.resetAuthInfoAdmin,
            resetAuthInfoNonAdmin: admin.resetAuthInfoNonAdmin,
            managePaymentTransactions: admin.managePaymentTransactions,
            messageUserEmailUser: admin.messageUserEmailUser,
            verifyOrgStatus: admin.verifyOrgStatus,
            deactivateUsers: admin.deactivateUsers,
            createRemoveHugs: admin.createRemoveHugs,
            createRemoveOrgs: admin.createRemoveOrgs,
            editApplications: admin.editApplications,
            readAuditTrail: admin.readAuditTrail
        };
    }

}
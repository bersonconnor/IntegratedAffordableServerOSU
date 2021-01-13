"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPrivilegesDBO = void 0;
const typeorm_1 = require("typeorm");
let AdminPrivilegesDBO = class AdminPrivilegesDBO {
    constructor(userId) {
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
    static fromAdminPrivileges(admin) {
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
    static toAdminPrivileges(admin, username) {
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
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], AdminPrivilegesDBO.prototype, "userid", void 0);
__decorate([
    typeorm_1.Column({ name: "Active" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "active", void 0);
__decorate([
    typeorm_1.Column({ name: "AllowRejectAdminRegistration" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "allowRejectAdminRegistration", void 0);
__decorate([
    typeorm_1.Column({ name: "RevokeAdminAccess" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "revokeAdminAccess", void 0);
__decorate([
    typeorm_1.Column({ name: "SetPrivileges" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "setPrivileges", void 0);
__decorate([
    typeorm_1.Column({ name: "ResetAuthInfoNonAdmin" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "resetAuthInfoNonAdmin", void 0);
__decorate([
    typeorm_1.Column({ name: "ResetAuthInfoAdmin" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "resetAuthInfoAdmin", void 0);
__decorate([
    typeorm_1.Column({ name: "ManagePaymentTransactions" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "managePaymentTransactions", void 0);
__decorate([
    typeorm_1.Column({ name: "MessageUserEmailUser" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "messageUserEmailUser", void 0);
__decorate([
    typeorm_1.Column({ name: "VerifyOrg501c3Status" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "verifyOrgStatus", void 0);
__decorate([
    typeorm_1.Column({ name: "DeactivateUsers" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "deactivateUsers", void 0);
__decorate([
    typeorm_1.Column({ name: "CreateRemoveHugs" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "createRemoveHugs", void 0);
__decorate([
    typeorm_1.Column({ name: "CreateRemoveOrgs" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "createRemoveOrgs", void 0);
__decorate([
    typeorm_1.Column({ name: "EditApplications" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "editApplications", void 0);
__decorate([
    typeorm_1.Column({ name: "ReadAuditTrail" }),
    __metadata("design:type", Boolean)
], AdminPrivilegesDBO.prototype, "readAuditTrail", void 0);
AdminPrivilegesDBO = __decorate([
    typeorm_1.Entity({ name: "AdminPrivileges" }),
    __metadata("design:paramtypes", [Number])
], AdminPrivilegesDBO);
exports.AdminPrivilegesDBO = AdminPrivilegesDBO;

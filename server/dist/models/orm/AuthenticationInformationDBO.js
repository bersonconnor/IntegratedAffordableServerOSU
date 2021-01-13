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
exports.AuthenticationInformationDBO = void 0;
const typeorm_1 = require("typeorm");
const OrganizationMembershipDBO_1 = require("./OrganizationMembershipDBO");
const ApplicationInformationDBO_1 = require("./grant/ApplicationInformationDBO");
let AuthenticationInformationDBO = class AuthenticationInformationDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AuthenticationInformationDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: "Username" }),
    __metadata("design:type", String)
], AuthenticationInformationDBO.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ name: "Password" }),
    __metadata("design:type", String)
], AuthenticationInformationDBO.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ name: "RequiresTwoFactorAuthentication" }),
    __metadata("design:type", Boolean)
], AuthenticationInformationDBO.prototype, "TwoFactor", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], AuthenticationInformationDBO.prototype, "TwoFactorCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], AuthenticationInformationDBO.prototype, "isDonor", void 0);
__decorate([
    typeorm_1.Column({ name: "Deactivated" }),
    __metadata("design:type", Boolean)
], AuthenticationInformationDBO.prototype, "deactivated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], AuthenticationInformationDBO.prototype, "isAdmin", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrganizationMembershipDBO_1.OrganizationMembershipDBO, membership => membership.donor),
    __metadata("design:type", Array)
], AuthenticationInformationDBO.prototype, "organizations", void 0);
__decorate([
    typeorm_1.OneToMany(type => ApplicationInformationDBO_1.ApplicationInformationDBO, grantApp => grantApp.user),
    __metadata("design:type", ApplicationInformationDBO_1.ApplicationInformationDBO)
], AuthenticationInformationDBO.prototype, "grantApplications", void 0);
AuthenticationInformationDBO = __decorate([
    typeorm_1.Entity({ name: "AuthenticationInformation" })
], AuthenticationInformationDBO);
exports.AuthenticationInformationDBO = AuthenticationInformationDBO;

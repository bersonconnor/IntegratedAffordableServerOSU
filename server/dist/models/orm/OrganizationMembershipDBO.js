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
exports.OrganizationMembershipDBO = void 0;
const typeorm_1 = require("typeorm");
const AuthenticationInformationDBO_1 = require("./AuthenticationInformationDBO");
const OrganizationDBO_1 = require("./OrganizationDBO");
let OrganizationMembershipDBO = class OrganizationMembershipDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OrganizationMembershipDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => AuthenticationInformationDBO_1.AuthenticationInformationDBO, user => user.organizations),
    __metadata("design:type", AuthenticationInformationDBO_1.AuthenticationInformationDBO)
], OrganizationMembershipDBO.prototype, "donor", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], OrganizationMembershipDBO.prototype, "donorId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => OrganizationDBO_1.OrganizationDBO, org => org.members),
    __metadata("design:type", OrganizationDBO_1.OrganizationDBO)
], OrganizationMembershipDBO.prototype, "organization", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], OrganizationMembershipDBO.prototype, "organizationId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], OrganizationMembershipDBO.prototype, "isAdmin", void 0);
__decorate([
    typeorm_1.Column('date'),
    __metadata("design:type", Date)
], OrganizationMembershipDBO.prototype, "membershipStartDate", void 0);
OrganizationMembershipDBO = __decorate([
    typeorm_1.Entity({ name: "OrgMembers" })
], OrganizationMembershipDBO);
exports.OrganizationMembershipDBO = OrganizationMembershipDBO;

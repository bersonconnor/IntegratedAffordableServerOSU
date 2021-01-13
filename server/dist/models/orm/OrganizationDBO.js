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
exports.OrganizationDBO = void 0;
const typeorm_1 = require("typeorm");
const OrganizationMembershipDBO_1 = require("./OrganizationMembershipDBO");
const GrantDBO_1 = require("./grant/GrantDBO");
let OrganizationDBO = class OrganizationDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OrganizationDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "fax", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "websiteUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "mission", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "ein", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "taxSection", void 0);
__decorate([
    typeorm_1.Column({ name: "IRSActivityCode" }),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "irsActivityCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], OrganizationDBO.prototype, "provideService", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], OrganizationDBO.prototype, "addBankingInfo", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], OrganizationDBO.prototype, "verified", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrganizationDBO.prototype, "apiKey", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrganizationMembershipDBO_1.OrganizationMembershipDBO, membership => membership.organization),
    __metadata("design:type", Array)
], OrganizationDBO.prototype, "members", void 0);
__decorate([
    typeorm_1.OneToMany(type => GrantDBO_1.GrantDBO, grant => grant.organization),
    __metadata("design:type", Array)
], OrganizationDBO.prototype, "grants", void 0);
OrganizationDBO = __decorate([
    typeorm_1.Entity({ name: "Organization" })
], OrganizationDBO);
exports.OrganizationDBO = OrganizationDBO;

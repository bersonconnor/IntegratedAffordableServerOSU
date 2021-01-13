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
exports.GrantDBO = void 0;
const typeorm_1 = require("typeorm");
const OrganizationDBO_1 = require("../OrganizationDBO");
const EligibilityCriteriaDBO_1 = require("./EligibilityCriteriaDBO");
const ApplicationInformationDBO_1 = require("./ApplicationInformationDBO");
let GrantDBO = class GrantDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GrantDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], GrantDBO.prototype, "grantName", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 13, scale: 2 }),
    __metadata("design:type", String)
], GrantDBO.prototype, "grantAmount", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime", nullable: false }),
    __metadata("design:type", Date)
], GrantDBO.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], GrantDBO.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GrantDBO.prototype, "category", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GrantDBO.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], GrantDBO.prototype, "organizationId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], GrantDBO.prototype, "recipientId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], GrantDBO.prototype, "eligibilityCriteriaId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => EligibilityCriteriaDBO_1.EligibilityCriteriaDBO, eligibility => eligibility.grants, {
        eager: true
    }),
    __metadata("design:type", EligibilityCriteriaDBO_1.EligibilityCriteriaDBO)
], GrantDBO.prototype, "eligibilityCriteria", void 0);
__decorate([
    typeorm_1.ManyToOne(type => OrganizationDBO_1.OrganizationDBO, org => org.grants, { eager: true }),
    __metadata("design:type", OrganizationDBO_1.OrganizationDBO)
], GrantDBO.prototype, "organization", void 0);
__decorate([
    typeorm_1.OneToMany(type => ApplicationInformationDBO_1.ApplicationInformationDBO, app => app.grant),
    __metadata("design:type", Array)
], GrantDBO.prototype, "applications", void 0);
GrantDBO = __decorate([
    typeorm_1.Entity({ name: "Grants" })
], GrantDBO);
exports.GrantDBO = GrantDBO;

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
exports.ApplicationInformationDBO = void 0;
const typeorm_1 = require("typeorm");
const AuthenticationInformationDBO_1 = require("../AuthenticationInformationDBO");
const GrantDBO_1 = require("./GrantDBO");
let ApplicationInformationDBO = class ApplicationInformationDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ApplicationInformationDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationInformationDBO.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => AuthenticationInformationDBO_1.AuthenticationInformationDBO, user => user.grantApplications),
    __metadata("design:type", AuthenticationInformationDBO_1.AuthenticationInformationDBO)
], ApplicationInformationDBO.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], ApplicationInformationDBO.prototype, "grantId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => GrantDBO_1.GrantDBO, grant => grant.applications),
    __metadata("design:type", GrantDBO_1.GrantDBO)
], ApplicationInformationDBO.prototype, "grant", void 0);
ApplicationInformationDBO = __decorate([
    typeorm_1.Entity({ name: "ApplicationInformation" })
], ApplicationInformationDBO);
exports.ApplicationInformationDBO = ApplicationInformationDBO;

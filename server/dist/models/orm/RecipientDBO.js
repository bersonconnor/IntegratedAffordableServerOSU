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
exports.RecipientDBO = void 0;
const typeorm_1 = require("typeorm");
const AuthenticationInformationDBO_1 = require("./AuthenticationInformationDBO");
const ApplicationInformationDBO_1 = require("./grant/ApplicationInformationDBO");
let RecipientDBO = class RecipientDBO {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "userId" }),
    typeorm_1.OneToOne(type => AuthenticationInformationDBO_1.AuthenticationInformationDBO),
    __metadata("design:type", Number)
], RecipientDBO.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToMany(type => ApplicationInformationDBO_1.ApplicationInformationDBO, app => app.userId),
    __metadata("design:type", ApplicationInformationDBO_1.ApplicationInformationDBO)
], RecipientDBO.prototype, "grantApplications", void 0);
RecipientDBO = __decorate([
    typeorm_1.Entity({ name: "Recipient" })
], RecipientDBO);
exports.RecipientDBO = RecipientDBO;

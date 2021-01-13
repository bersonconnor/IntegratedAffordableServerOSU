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
exports.TwoFactorDBO = void 0;
const typeorm_1 = require("typeorm");
let TwoFactorDBO = class TwoFactorDBO {
};
__decorate([
    typeorm_1.Column({ name: "DeviceName" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "deviceName", void 0);
__decorate([
    typeorm_1.Column({ name: "Username" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ name: "Email" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "email", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ name: "RandomString" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "randomString", void 0);
__decorate([
    typeorm_1.Column({ name: "Timestamp" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column({ name: "Secret" }),
    __metadata("design:type", String)
], TwoFactorDBO.prototype, "secret", void 0);
TwoFactorDBO = __decorate([
    typeorm_1.Entity({ name: "twofactor" })
], TwoFactorDBO);
exports.TwoFactorDBO = TwoFactorDBO;

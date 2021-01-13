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
exports.AuditTrailDBO = void 0;
const typeorm_1 = require("typeorm");
let AuditTrailDBO = class AuditTrailDBO {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AuditTrailDBO.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: "admin" }),
    __metadata("design:type", String)
], AuditTrailDBO.prototype, "admin", void 0);
__decorate([
    typeorm_1.Column({ name: "action" }),
    __metadata("design:type", String)
], AuditTrailDBO.prototype, "action", void 0);
__decorate([
    typeorm_1.Column({ name: "time" }),
    __metadata("design:type", Date)
], AuditTrailDBO.prototype, "time", void 0);
AuditTrailDBO = __decorate([
    typeorm_1.Entity({ name: "AuditTrail" })
], AuditTrailDBO);
exports.AuditTrailDBO = AuditTrailDBO;

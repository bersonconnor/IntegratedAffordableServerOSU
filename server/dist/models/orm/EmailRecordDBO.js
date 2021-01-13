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
exports.EmailRecordDBO = void 0;
const typeorm_1 = require("typeorm");
let EmailRecordDBO = class EmailRecordDBO {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], EmailRecordDBO.prototype, "userId", void 0);
__decorate([
    typeorm_1.PrimaryColumn({ nullable: false }),
    __metadata("design:type", String)
], EmailRecordDBO.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ name: "primary_ind", nullable: false }),
    __metadata("design:type", Boolean)
], EmailRecordDBO.prototype, "isPrimary", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Boolean)
], EmailRecordDBO.prototype, "verified", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], EmailRecordDBO.prototype, "verificationCode", void 0);
EmailRecordDBO = __decorate([
    typeorm_1.Entity({ name: "emails" })
], EmailRecordDBO);
exports.EmailRecordDBO = EmailRecordDBO;

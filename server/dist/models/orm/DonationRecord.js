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
exports.DonationRecord = void 0;
const typeorm_1 = require("typeorm");
let DonationRecord = class DonationRecord {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DonationRecord.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DonationRecord.prototype, "grantId", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 13, scale: 2 }),
    __metadata("design:type", Number)
], DonationRecord.prototype, "donateAmount", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DonationRecord.prototype, "donorId", void 0);
DonationRecord = __decorate([
    typeorm_1.Entity({ name: "Donates" })
], DonationRecord);
exports.DonationRecord = DonationRecord;

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
exports.IdentificationInformation = void 0;
const typeorm_1 = require("typeorm");
let IdentificationInformation = class IdentificationInformation {
};
__decorate([
    typeorm_1.PrimaryColumn({ name: "id" }),
    __metadata("design:type", Number)
], IdentificationInformation.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IdentificationInformation.prototype, "birthdate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IdentificationInformation.prototype, "SSN", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IdentificationInformation.prototype, "citizenshipStatus", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IdentificationInformation.prototype, "countryOfBirth", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IdentificationInformation.prototype, "alienNumber", void 0);
IdentificationInformation = __decorate([
    typeorm_1.Entity({ name: "identificationInformation" })
], IdentificationInformation);
exports.IdentificationInformation = IdentificationInformation;

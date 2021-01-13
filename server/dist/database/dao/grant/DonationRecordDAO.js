"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRecordDAO = void 0;
const typeorm_1 = require("typeorm");
const DonationRecord_1 = require("../../../models/orm/DonationRecord");
const Validation_1 = require("../../../utils/Validation");
class DonationRecordDAO {
    constructor() {
        this.connection = typeorm_1.getConnection();
    }
    /**
     * Creates a donation record in AFFORDABLE
     * @param record
     */
    async getDonationRecordsForGrant(grantId) {
        Validation_1.Validation.requireParam(grantId, "grantId");
        const result = await new Promise((res, rej) => {
            this.connection.manager
                .getRepository(DonationRecord_1.DonationRecord)
                .createQueryBuilder("record")
                .where("record.grantId = :id", { id: grantId })
                .getMany()
                .then(result => res(result))
                .catch(error => {
                console.log(error);
                rej(error);
            });
        });
        console.log("Donation records retrieved for grant " + grantId);
        return result;
    }
    /**
     * Creates a donation record in AFFORDABLE
     * @param record
     */
    async createDonationRecord(record) {
        Validation_1.Validation.requireParam(record.donorId, "donorId");
        Validation_1.Validation.requireParam(record.grantId, "grantId");
        Validation_1.Validation.requireParam(record.donateAmount, "donateAmount");
        const result = await new Promise((res, rej) => {
            this.connection
                .getRepository(DonationRecord_1.DonationRecord)
                .save(record)
                .then(result => res(result))
                .catch(error => {
                console.log(error);
                rej(error);
            });
        });
        console.log("Donation record created: " + result);
        return result;
    }
    /**
     * Deletes a donation record in AFFORDABLE
     * @param id
     */
    async deleteDonationRecord(id) {
        await new Promise((res, rej) => {
            this.connection.manager
                .getRepository(DonationRecord_1.DonationRecord)
                .createQueryBuilder()
                .delete()
                .from(DonationRecord_1.DonationRecord)
                .where("id = :id", { id: id })
                .execute()
                .then(result => res(result))
                .catch(error => {
                console.log(error);
                rej(error);
            });
        });
        console.log("Donation record deleted: " + id);
    }
}
exports.DonationRecordDAO = DonationRecordDAO;

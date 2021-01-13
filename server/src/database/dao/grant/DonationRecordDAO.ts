import { Connection, getConnection } from "typeorm";
import { DonationRecord } from "../../../models/orm/DonationRecord";
import { Validation } from "../../../utils/Validation";

export class DonationRecordDAO {
    private connection: Connection;

    public constructor() {
        this.connection = getConnection();
    }


    /**
     * Creates a donation record in AFFORDABLE
     * @param record 
     */
    public async getDonationRecordsForGrant(grantId: number): Promise<Array<DonationRecord>> {
        Validation.requireParam(grantId, "grantId")

        const result = await new Promise((res, rej) => {
            this.connection.manager
                .getRepository(DonationRecord)
                .createQueryBuilder("record")
                .where("record.grantId = :id", { id: grantId })
                .getMany()
                .then(result => res(result))
                .catch(error => {
                    console.log(error)
                    rej(error);
                })
        });
        console.log("Donation records retrieved for grant " + grantId);
        return <Array<DonationRecord>>result;
    }

    /**
     * Creates a donation record in AFFORDABLE
     * @param record 
     */
    public async createDonationRecord(record: DonationRecord): Promise<DonationRecord> {
        Validation.requireParam(record.donorId, "donorId");
        Validation.requireParam(record.grantId, "grantId");
        Validation.requireParam(record.donateAmount, "donateAmount");

        const result = await new Promise((res, rej) => {
            this.connection
                .getRepository(DonationRecord)
                .save(record)
                .then(result => res(result))
                .catch(error => {
                    console.log(error)
                    rej(error);
                })
        });
        console.log("Donation record created: " + result);
        return <DonationRecord>result;
    }

    /**
     * Deletes a donation record in AFFORDABLE
     * @param id 
     */
    public async deleteDonationRecord(id: string): Promise<void> {
        await new Promise((res, rej) => {
            this.connection.manager
                .getRepository(DonationRecord)
                .createQueryBuilder()
                .delete()
                .from(DonationRecord)
                .where("id = :id", { id: id })
                .execute()
                .then(result => res(result))
                .catch(error => {
                    console.log(error)
                    rej(error);
                });
        })
        console.log("Donation record deleted: " + id);
    }
}
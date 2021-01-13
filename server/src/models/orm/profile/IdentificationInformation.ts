import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "identificationInformation" })
export class IdentificationInformation {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    birthdate: string;

    @Column()
    SSN: string;

    @Column()
    citizenshipStatus: string;

    @Column()
    countryOfBirth: string;

    @Column()
    alienNumber: string;
}
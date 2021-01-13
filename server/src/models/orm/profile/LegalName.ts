import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "legalName" })
export class LegalName {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    firstName: string;

    @Column()
    middleName: string;

    @Column()
    lastName: string;

    @Column()
    suffix: string;

    @PrimaryColumn()
    isCurrentLegalName: boolean;
}
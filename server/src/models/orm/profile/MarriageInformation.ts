import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "marriageInformation" })
export class MarriageInformation {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    marriageStatus: string;

    @Column()
    numberOfChildren: number;
}
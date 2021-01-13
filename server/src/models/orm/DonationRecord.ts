import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Donates" })
export class DonationRecord {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    grantId: number;

    @Column("decimal", { precision: 13, scale: 2 })
    donateAmount: number;

    @Column()
    donorId: number;
}
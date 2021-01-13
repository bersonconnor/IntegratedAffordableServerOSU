import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "Donor" })
export class Donor {
    @PrimaryColumn()
    id: number;
}
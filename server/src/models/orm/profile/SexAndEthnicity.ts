import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "sexAndEthnicity" })
export class SexAndEthnicity {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    biologicalSex: string;

    @Column()
    ethnicity: string;
}
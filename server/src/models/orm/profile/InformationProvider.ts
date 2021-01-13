import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "informationProvider" })
export class InformationProvider {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    informationProvider: string;

    @Column()
    relationshipToPatient: string;

    @Column()
    placeOfEmployment: string;
}
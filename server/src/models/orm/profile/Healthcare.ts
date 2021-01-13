import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "healthcare" })
export class Healthcare {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    hasPhysician: boolean;

    @Column()
    physicianFirstName: string;

    @Column()
    physicianLastName: string;

    @Column()
    physicianLocation: string;
}
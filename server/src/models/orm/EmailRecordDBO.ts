import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { AuthenticationInformationDBO } from "./AuthenticationInformationDBO";

@Entity({ name: "emails" })
export class EmailRecordDBO {

    @Column()
    userId: number;

    @PrimaryColumn({ nullable: false })
    email: string;

    @Column({name: "primary_ind", nullable: false})
    isPrimary: boolean;

    @Column({nullable: false})
    verified: boolean;

    @Column()
    verificationCode: string;
}
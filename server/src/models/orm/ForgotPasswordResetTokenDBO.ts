import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "ForgotPasswordResetToken" })
export class ForgotPasswordResetTokenDBO {

    @PrimaryColumn({ nullable: false })
    userId: number;

    @PrimaryColumn({ nullable: false })
    secret: string;

    @Column({ nullable: false, type: "datetime"})
    expirationDate: Date;
}
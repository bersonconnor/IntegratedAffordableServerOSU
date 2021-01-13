import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "phoneNumbers" })
export class PhoneNumber {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @PrimaryColumn()
    phone: string;

    @Column()
    preference: number;

    @Column()
    preferredLanguage: string;
}
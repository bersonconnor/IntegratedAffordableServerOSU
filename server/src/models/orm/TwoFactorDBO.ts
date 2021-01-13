import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({name: "twofactor"})
export class TwoFactorDBO {

    @Column({ name: "DeviceName" })
    deviceName: string;

    @Column({ name: "Username" })
    username: string;

    @Column({ name: "Email" })
    email: string;

    @PrimaryColumn({ name: "RandomString" })
    randomString: string;
    
    @Column({ name: "Timestamp" })
    timestamp: string;

    @Column({ name: "Secret" })
    secret: string;
}
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "AuditTrail" })
export class AuditTrailDBO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "admin" })
    admin: string;

    @Column({ name: "action" })
    action: string;

    @Column({ name: "time" })
    time: Date;
}
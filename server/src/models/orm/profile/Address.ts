import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "userAddress" })
export class Address {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zipcode: string;
}
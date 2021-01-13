import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {OrganizationMembershipDBO} from "./OrganizationMembershipDBO";
import { GrantDAO } from "../../database/dao/grant/GrantDAO";
import { GrantDBO } from "./grant/GrantDBO";

@Entity({ name: "Organization" })
export class OrganizationDBO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    fax: string;

    @Column()
    websiteUrl: string;

    @Column()
    mission: string;

    @Column()
    ein: string;

    @Column()
    taxSection: string;

    @Column({ name: "IRSActivityCode" })
    irsActivityCode: string;

    @Column()
    provideService: boolean;

    @Column()
    addBankingInfo: boolean;
    
    @Column()
    verified: boolean;

    @Column()
    apiKey: string;

    @OneToMany(type => OrganizationMembershipDBO, membership => membership.organization)
    public members?: OrganizationMembershipDBO[];

    @OneToMany(type => GrantDBO, grant => grant.organization)
    public grants?: GrantDBO[];
}
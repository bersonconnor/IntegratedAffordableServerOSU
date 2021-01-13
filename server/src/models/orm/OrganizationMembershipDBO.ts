import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AuthenticationInformationDBO} from "./AuthenticationInformationDBO";
import {OrganizationDBO} from "./OrganizationDBO";

@Entity({ name: "OrgMembers" })
export class OrganizationMembershipDBO {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AuthenticationInformationDBO, user => user.organizations)
    public donor!: AuthenticationInformationDBO;

    @Column({type: "int"})
    public donorId: number;

    @ManyToOne(type => OrganizationDBO, org => org.members)
    public organization!: OrganizationDBO;

    @Column({type: "int"})
    public organizationId: number;


    @Column()
    isAdmin: boolean;

    @Column('date')
    membershipStartDate: Date;

}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthenticationInformationDBO } from "../AuthenticationInformationDBO";
import { GrantDBO } from "./GrantDBO";

@Entity({ name: "ApplicationInformation" })
export class ApplicationInformationDBO {

    /**
     * The unique ID of the association.
     */
    @PrimaryGeneratedColumn()
    id?: number;

    /**
     * The ID of a user that has applied to a particular grant
     */
    @Column({ nullable: false})
    public userId!: number;

    @ManyToOne(type => AuthenticationInformationDBO, user => user.grantApplications)
    public user?: AuthenticationInformationDBO;

    /**
     * The ID of a grant to which a user has applied
     */
    @Column({ nullable: false})
    public grantId!: number;

    @ManyToOne(type => GrantDBO, grant => grant.applications)
    public grant?: GrantDBO;
}
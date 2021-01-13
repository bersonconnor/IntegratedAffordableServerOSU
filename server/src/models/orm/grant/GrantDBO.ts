import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrganizationDBO } from "../OrganizationDBO";
import { EligibilityCriteria } from "affordable-shared-models/dist/models/EligibilityCriteria";
import { EligibilityCriteriaDBO } from "./EligibilityCriteriaDBO";
import { ApplicationInformationDBO } from "./ApplicationInformationDBO";

@Entity({ name: "Grants" })
export class GrantDBO {

    /**
     * The unique ID of the grant.
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The name or title of the grant
     */
    @Column({ nullable: false})
    grantName: string;

    /**
     * The valuation of the grant, in USD
     */
    @Column("decimal", { precision: 13, scale: 2 })
    grantAmount: string;

    /**
     * The earliest time in which one can apply for a grant
     */
    @Column({type: "datetime", nullable: false})
    startTime: Date;

    /** 
     * The latest time in which one can apply for a grant.
     */
    @Column({ type: "datetime", nullable: true })
    endTime?: Date;

    /**
     * The category of the grant
     */
    @Column()
    category: string;

    /**
     * A description of the grant's purpose, and other relevant information.
     */
    @Column()
    description: string;

    /**
     * The organization that manages this grant
     */
    @Column({nullable: false})
    organizationId: number;

    /**
     * The recipient that has been awarded this grant. 
     */
    @Column({nullable: true})
    recipientId?: number;

    /**
     * The ID of the grant eligibility criteria that must be met for a user to apply for a grant.
     * If null, any user may apply.
     */
    @Column({nullable: true})
    eligibilityCriteriaId?: number;

    /**
     * The organization that manages this grant
     */
    @ManyToOne(type => EligibilityCriteriaDBO, eligibility => eligibility.grants, {
        eager: true
    })
    eligibilityCriteria?: EligibilityCriteriaDBO;


    /**
     * The organization that manages this grant
     */
    @ManyToOne(type => OrganizationDBO, org => org.grants, {eager: true})
    organization?: OrganizationDBO;

    @OneToMany(type => ApplicationInformationDBO, app => app.grant)
    applications?: Array<ApplicationInformationDBO>;
}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrantDBO } from "./GrantDBO";
import { Grant } from "affordable-shared-models";

@Entity({name: "EligibilityCriteria"})
export class EligibilityCriteriaDBO {

    /**
     * The unique ID of the eligibility restrictions
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The organization that owns this eligibility criteria. Only grants in this organization may use/modify it
     */
    @Column({ nullable: false })
    public organizationId: number;

    /**
     * Requires a user to have a particular email address to apply to a grant.
     */
    @Column({ nullable: true })
    emailAddress?: string;

    // The grants that this eligibilty applies to
    @OneToMany(type => GrantDBO, grant => grant.eligibilityCriteria)
    grants?: GrantDBO[];

    // Currently, the only valid eligibility criteria is email address

    /**
     * Requires a user to be above a certain age to apply to a grant.
     */
    // @Column()
    // minimumAge: number;

    /**
     * Requires a user to be below a certain age to apply to a grant.
     */
    // @Column()
    // maximumAge: number;

    /**
     * Requires a user to be of a particular sex to apply to a grant.
     */
    // @Column()
    // sex: string;

    /**
     * Requires a user to be of a particular ethnic group to apply to a grant.
     */
    // @Column()
    // ethnicity: string;

    /**
     * Requires a user to be/not be a United States citizen to apply to a grant.
     */
    // @Column()
    // isUsCitizen: boolean;
    
    /**
     * Requires a user to have above a minimum income threshold to apply to a grant
     */
    // @Column()
    // minimumIncome: number;

    /**
     * Requires a user to have below a maximum income threshold to apply to a grant
     */
    // @Column()
    // maximumIncome: number;
}
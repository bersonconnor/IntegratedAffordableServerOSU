import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "insurance" })
export class Insurance {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    hasInsurance: boolean;

    @Column()
    primaryInsurance: string;

    @Column()
    planType: string;

    @Column()
    policyId: string;

    @Column()
    policyHolder: string;

    @Column()
    insuranceFromEmployer: boolean;

    @Column()
    companyName: string;

    @Column()
    groupNumberPlanCode: string;

    @Column()
    hasDeductiblesOrCoPayments: boolean;

    @Column()
    deductibleAmount: string;

    @Column()
    copayment: string;
}
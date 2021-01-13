import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "finances" })
export class Finances {

    @PrimaryColumn({ name: "id" })
    userId: number;

    @Column()
    employmentStatus: boolean;

    @Column()
    currentEmployer: string;

    @Column()
    positionTitle: string;

    @Column()
    grossAnnualIncome: string;

    @Column()
    unemploymentPeriod: string;

    @Column()
    receivesFinancialAssistance: boolean;

    @Column()
    assistanceExplanation: string;

    @Column()
    receivesSocialSecurity: boolean;

    @Column()
    numberOfPeopleInHousehold: number;
}
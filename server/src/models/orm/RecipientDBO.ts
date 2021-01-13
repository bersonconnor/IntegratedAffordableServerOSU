import { Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { AuthenticationInformationDBO } from "./AuthenticationInformationDBO";
import { ApplicationInformationDBO } from "./grant/ApplicationInformationDBO";

@Entity({name: "Recipient"})
export class RecipientDBO {

    @PrimaryColumn({ name: "userId" })
    @OneToOne(type => AuthenticationInformationDBO)
    userId: number;

    @OneToMany(type => ApplicationInformationDBO, app => app.userId)
    grantApplications: ApplicationInformationDBO;
}
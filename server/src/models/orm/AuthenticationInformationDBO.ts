import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrganizationMembershipDBO } from "./OrganizationMembershipDBO";
import { ApplicationInformationDBO } from "./grant/ApplicationInformationDBO";

@Entity({ name: "AuthenticationInformation" })
export class AuthenticationInformationDBO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "Username" })
    username: string;

    @Column({ name: "Password" })
    password: string;

    @Column({ name: "RequiresTwoFactorAuthentication" })
    TwoFactor: boolean;

    @Column()
    TwoFactorCode: string;

    @Column()
    isDonor: boolean;

    @Column({ name: "Deactivated" })
    deactivated: boolean;

    //
    @Column()
    isAdmin: boolean;

    @OneToMany(type => OrganizationMembershipDBO, membership => membership.donor)
    public organizations!: OrganizationMembershipDBO[];

    @OneToMany(type => ApplicationInformationDBO, grantApp => grantApp.user)
    public grantApplications?: ApplicationInformationDBO;
}
import { ProfileFields, UserInfo } from "affordable-shared-models";
import { ProfileService } from "../services/ProfileService";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";


export class ProfileController {

    private profileService: ProfileService;
    private authenticationService: AuthenticationService;
    // TODO: Consider DI
    public constructor(profileService?: ProfileService,
                       authenticationService?: AuthenticationService) {
        this.profileService = profileService ?? new ProfileService();
        this.authenticationService = authenticationService ?? new AuthenticationServiceImpl();
    }

    /**
     * Create a profile in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public createProfile = async (req, res, next): Promise<void> => {
        const profile: ProfileFields.Profile = <ProfileFields.Profile>req.body.profile;
        const userInfo: UserInfo = res.locals.userInfo;
        try {
            await this.profileService.createProfile(profile, userInfo);
            res.send(200);
        } catch (error) {
            res.status(500) && next(error);
        }
    }

    /**
     * Create a profile in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public getProfile = async (req, res, next): Promise<void> => {
        const userId: number = req.query.userId;
        try {
            const profile = await this.profileService.getProfile(userId);
            res.status(200).send(profile);
        } catch (error) {
            res.status(500) && next(error);
        }
    }

    /**
     * Create a profile in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public deleteProfile = async (req, res, next): Promise<void> => {
        const userId: number = req.query.userId;
        try {
            await this.profileService.deleteProfile(userId);
            res.send(200);
        } catch (error) {
            res.status(500) && next(error);
        }
    }


    /**
     * Get the a users' primary email address
     * @param req Express request object, the body should be a username
     * @param res Express response object
     * @param next Express next function
     */
    public getPrimaryEmail = async (req, res, next): Promise<void> => {
        const username: string = <string>req.param('username');
        try {
            const email: string = await this.profileService.getPrimaryEmail(username);
            res.status(200).json({ email });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get the a users' primary email address
     * @param req Express request object, the body should be a username
     * @param res Express response object
     * @param next Express next function
     */
    public getUserInfo = async (req, res, next): Promise<void> => {
        const userId: number = Number.parseInt(req.params.userId);
        try {
            const userInfo: UserInfo = await this.authenticationService.getUserInfo(userId);
            res.status(200).json(userInfo);
        } catch (error) {
            next(error);
        }
    }

}
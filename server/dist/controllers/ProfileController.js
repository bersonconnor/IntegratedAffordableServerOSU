"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const ProfileService_1 = require("../services/ProfileService");
const AuthenticationServiceImpl_1 = require("../services/AuthenticationServiceImpl");
class ProfileController {
    // TODO: Consider DI
    constructor(profileService, authenticationService) {
        /**
         * Create a profile in Affordable
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function
         */
        this.createProfile = async (req, res, next) => {
            const profile = req.body.profile;
            const userInfo = res.locals.userInfo;
            try {
                await this.profileService.createProfile(profile, userInfo);
                res.send(200);
            }
            catch (error) {
                res.status(500) && next(error);
            }
        };
        /**
         * Create a profile in Affordable
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function
         */
        this.getProfile = async (req, res, next) => {
            const userId = req.query.userId;
            try {
                const profile = await this.profileService.getProfile(userId);
                res.status(200).send(profile);
            }
            catch (error) {
                res.status(500) && next(error);
            }
        };
        /**
         * Create a profile in Affordable
         * @param req Express request object
         * @param res Express response object
         * @param next Express next function
         */
        this.deleteProfile = async (req, res, next) => {
            const userId = req.query.userId;
            try {
                await this.profileService.deleteProfile(userId);
                res.send(200);
            }
            catch (error) {
                res.status(500) && next(error);
            }
        };
        /**
         * Get the a users' primary email address
         * @param req Express request object, the body should be a username
         * @param res Express response object
         * @param next Express next function
         */
        this.getPrimaryEmail = async (req, res, next) => {
            const username = req.param('username');
            try {
                const email = await this.profileService.getPrimaryEmail(username);
                res.status(200).json({ email });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get the a users' primary email address
         * @param req Express request object, the body should be a username
         * @param res Express response object
         * @param next Express next function
         */
        this.getUserInfo = async (req, res, next) => {
            const userId = Number.parseInt(req.params.userId);
            try {
                const userInfo = await this.authenticationService.getUserInfo(userId);
                res.status(200).json(userInfo);
            }
            catch (error) {
                next(error);
            }
        };
        this.profileService = profileService !== null && profileService !== void 0 ? profileService : new ProfileService_1.ProfileService();
        this.authenticationService = authenticationService !== null && authenticationService !== void 0 ? authenticationService : new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
    }
}
exports.ProfileController = ProfileController;

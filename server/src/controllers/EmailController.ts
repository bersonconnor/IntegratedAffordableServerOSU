import {UserInfo} from "affordable-shared-models";
import {NextFunction, Request, Response} from "express";
import {EmailService} from "../services/EmailService";



export class EmailController {

    emailService: EmailService;

    public constructor(emailService?: EmailService) {
        this.emailService = emailService ?? new EmailService();
    }

    public checkEmailVerification = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userInfo: UserInfo = res.locals.userInfo;
            const isVerified: Boolean = await this.emailService.isVerified(userInfo.id);
            res.status(200).send({isVerified: isVerified});
        } catch (error) {
            next(error);
        }
    }

    public updatePrimaryEmail = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const email: string = req.body.email;
        const userInfo: UserInfo = res.locals.userInfo;
        try{
            await this.emailService.updateEmail(userInfo, email);
            res.send(200);
        } catch(error){
            next(error);
        }
    }

    public verifyEmail = async(req: Request, res: Response): Promise<void> => {
        //parse code from url
        const code = req.query.code;
        console.log("emailcontroller code: " + code);
        //get correct redirect url from emailService
        const redirectUrl = await this.emailService.verifyEmail(code as string);
        res.redirect(redirectUrl);
    }

    /** 
     * called when the user forgets their username or password
     * this will send the user an email containing their username
     * and also a link at which they will be able to reset their password
     * */ 
    public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const email: string = req.body.email;
        try {
            await this.emailService.sendResetPasswordEmail(email);
            res.send(200);
        } catch (error) {
            next(error);
        }
    }
    
}
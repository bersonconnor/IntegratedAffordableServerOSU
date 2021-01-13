/**
 * This class contains the necessary request information a user needs in order to reset their password
 */
export class ChangePasswordReq {
    /**
     * The user's old password
     */
    oldPassword: string;

    /** 
     * The user's new password
     */
    newPassword: string;
}

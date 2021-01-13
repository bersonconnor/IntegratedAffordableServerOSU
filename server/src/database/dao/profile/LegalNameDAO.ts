import {LegalName} from "../../../models/orm/profile/LegalName";
import {NotFoundError} from "../../../models/NotFoundError";

export interface LegalNameDAO {
    /**
     * Adds legal name information to a user's profile, can be used for creating and updating
     * @param legalName
     */
    addLegalName(legalName: LegalName): Promise<LegalName>;

    /**
     * Get a legal name(s) in AFFORDABLE by the User's ID
     * @param id
     * @throws NotFoundError if no legal name for the user is found
     */
    getAllLegalNamesWithUserId(id: number): Promise<Array<LegalName>>;

    /**
     * Deletes legal name(s) info within a profile for a user by ID in AFFORDABLE
     * @param id
     */
    deleteUserLegalNamesById(id: number): Promise<void>;
}
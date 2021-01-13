import { FileService } from "../services/FileService";
import { errorHandler } from "./ErrorHandler";
import AuthenticationRouter from "./AuthenticationRouter";

const service = FileService.getInstance();
const router = require('express').Router();

router.use(AuthenticationRouter.verifyToken);

/**
 * @api {POST} /upload file
 * @apiName upload
 * @apiGroup file
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
router.post('/upload', service.uploadFile);

/**
 * @api {POST} /download file
 * @apiName download 
 * @apiGroup file
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
router.post('/download', service.downloadFile);




router.use(errorHandler);

module.exports = router;

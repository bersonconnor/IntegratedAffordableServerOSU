"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileService_1 = require("../services/FileService");
const ErrorHandler_1 = require("./ErrorHandler");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const service = FileService_1.FileService.getInstance();
const router = require('express').Router();
router.use(AuthenticationRouter_1.default.verifyToken);
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
router.use(ErrorHandler_1.errorHandler);
module.exports = router;

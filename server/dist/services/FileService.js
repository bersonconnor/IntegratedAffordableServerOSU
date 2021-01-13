"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const fs = require('fs');
//const multiparty = require('multiparty');
//const Readable = require('stream').Readable;
const bluebird = require('bluebird');
const AWS = require('aws-sdk');
const dotenv_1 = require("dotenv");
dotenv_1.config();
//configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_SECRET
});
// create S3 instance
const s3 = new AWS.S3();
AWS.config.setPromisesDependency(bluebird);
// create S3 instance
//create DB instance
const connectionPool = DatabaseConnection_1.default.getInstance();
class FileService {
    constructor() {
        this.uploadFile = async (req, res) => {
            var fileMap = new Map();
            fileMap.set("file0", req.body.file0);
            fileMap.set("file1", req.body.file1);
            fileMap.set("file2", req.body.file2);
            var i = 0;
            var fileArr = req.files.file;
            var fileName;
            var timestamp;
            var buffer;
            var data;
            var fileCount = req.body.fileCount;
            var i = 0;
            try {
                if (fileCount == 1) {
                    buffer = fileArr.data;
                    timestamp = Date.now().toString();
                    fileName = `${process.env.UPLOAD_FOLDER}/${fileMap.get("file" + i)}`;
                    data = await this.uploadToS3(fileArr.data, fileName, fileArr.mimetype);
                    console.log(data);
                }
                else { // Multiple File upload
                    for (i = 0; i < fileArr.length; i++) {
                        buffer = fileArr[i].data;
                        timestamp = Date.now().toString();
                        fileName = `${process.env.UPLOAD_FOLDER}/${fileMap.get("file" + i)}`;
                        data = await this.uploadToS3(fileArr[i].data, fileName, fileArr[i].mimetype);
                        console.log(data);
                    }
                }
                res.status(200).json({ success: 'File uploaded to S3' });
            }
            catch (error) {
                console.log("Failed to Upload to S3");
                console.log(error);
                return res.status(400).send(error);
            }
        };
        this.uploadToS3 = (buffer, name, mime) => {
            const params = {
                ACL: 'public-read',
                Body: buffer,
                Bucket: process.env.AWS_BUCKET_NAME,
                ContentType: mime,
                Key: name
            };
            console.log("in s3");
            return s3.upload(params).promise();
        };
        this.downloadFile = (req, res) => {
            var fileName = req.body.fileName;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${process.env.UPLOAD_FOLDER}/${fileName}`
            };
            s3.getObject(params, function (error, data) {
                if (error) {
                    console.log(error);
                }
                else {
                    let stream = s3.getObject(params).createReadStream();
                    res.send(data.Body);
                }
            });
        };
    }
}
exports.FileService = FileService;
FileService.instance = new FileService();
FileService.getInstance = () => FileService.instance;

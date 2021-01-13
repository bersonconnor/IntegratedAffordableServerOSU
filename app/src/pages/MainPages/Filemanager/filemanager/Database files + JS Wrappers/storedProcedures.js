// storedProcedures.js
// Affordable Gettysburg: File Manager
// 10-28-19
// Javascript wrappers for common mysql queries
import UpdateFileFilePath from "UpdateFileFilePath.sql"
import UpdateFilePermission from "UpdateFilePermission.sql"
import DeleteFilePermission from "DeleteFilePermission.sql"
import DeleteFileFromFilesDatabase from "DeleteFileFromFilesDatabase.sql"
import AddPermissionToFile from "AddPermissionToFile.sql"
import AddFileToFilesDatabase from "AddFileToFilesDatabase.sql"

// add require mysql and connection vars?
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost:3020',
    user: 'root',
    password: 'password'
});

const ObjToExport = function(func) {
    return function(qType) {
        obj = Queries(qType);
        return ExportModule(obj);
    }
}

function GetQueries(qType) {
    if (qType == "upload"){
        return {
            AddFileToFilesDatabase: 'CALL AddFileToFilesDatabase(?)',
            AddPermissionToFile: 'CALL AddPermissionToFile(?)'
        }
    }
    else if (qType == "changePath"){
        return {
            UpdateFileFilePath: 'CALL UpdateFileFilePath(?)'
        }
    }
    else if (qType == "changePermissions"){
        return {
            UpdateFilePermissions: 'CALL UpdateFilePermissions(?)'
        }
    }
    else if (qType == "delete"){
        return {
            DeleteFilePermission: 'CALL DeleteFilePermission(?)',
            DeleteFileFromFilesDatabase: 'CALL DeleteFileFromFilesDatabase(?)'
        }
    }
    else return null;
};

function ExportModule(obj){
    if (obj != null){
        module.exports = obj;
    }
}

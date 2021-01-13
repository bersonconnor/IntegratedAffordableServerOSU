CREATE DATABASE IF NOT EXISTS Affordable;
USE Affordable;

DROP TABLE IF EXISTS AuthenticationInformation;
CREATE TABLE AuthenticationInformation(
    `ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Username` VARCHAR(255),
    `Password` VARCHAR(255),
    `Email` VARCHAR(255),
    `Question1` VARCHAR(255),
    `Answer1` VARCHAR(255),
    `Question2` VARCHAR(255),
    `Answer2` VARCHAR(255),
    `Question3` VARCHAR(255),
    `Answer3` VARCHAR(255),
    `RequiresTwoFactorAuthentication` VARCHAR(255),
    `TwoFactorCode` VARCHAR(255),
    `Deactivated` BOOLEAN
);

DROP TABLE IF EXISTS emails;
CREATE TABLE emails(
    `Username` VARCHAR(255),
    `Email` VARCHAR(255),
    `primary_ind` BOOLEAN,
    `verified` BOOLEAN
);

DROP TABLE IF EXISTS requests;
CREATE TABLE requests(
    `Username` VARCHAR(255),
    `NewEmail` VARCHAR(255),    
    `OldEmail` VARCHAR(255),
    `RandomString` VARCHAR(255),
    `Timestamp` VARCHAR(255),
    `Secret` VARCHAR(255)

);

DROP TABLE IF EXISTS twofactor;
CREATE TABLE twofactor(
    `DeviceName` VARCHAR(255),
    `Username` VARCHAR(255),
    `Email` VARCHAR(255),    
    `RandomString` VARCHAR(255),
    `Timestamp` VARCHAR(255)
);
DROP TABLE IF EXISTS activitylog;
CREATE TABLE activitylog(
    `IP_addr` VARCHAR(255),
    `Username` VARCHAR(255),
    `Last_Act` VARCHAR(255),
    `city` VARCHAR(255),
    `state` VARCHAR(255),
    `Timestamp` VARCHAR(255)
);
DROP TABLE IF EXISTS emailReadReceipt;
CREATE TABLE emailReadReceipt(
    `Username` VARCHAR(255),
    `Email_Id` VARCHAR(255),
    `Email_Description` VARCHAR(255),
    `Has_Been_Read` VARCHAR(255)
);


DROP TABLE IF EXISTS files;
CREATE TABLE files(
    `File_Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `User_Id` INT NOT NULL,
    `PathName` VARCHAR(255),
    `Url` VARCHAR(255),
    `EncryptionType` VARCHAR(25),
    `FileType` VARCHAR(5),
    `Size` INT,
    `DateAdded` DATETIME
);

DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions(
    `File_Id` INT NOT NULL,
    `User_Id` INT NOT NULL,
    `PermissionType` VARCHAR(10),
    PRIMARY KEY(`File_Id`, `User_Id`)
);

DROP TABLE IF EXISTS encryptions;
CREATE TABLE encryptions(
    `File_Id` INT NOT NULL PRIMARY KEY,
    `Password` VARCHAR(255)
);
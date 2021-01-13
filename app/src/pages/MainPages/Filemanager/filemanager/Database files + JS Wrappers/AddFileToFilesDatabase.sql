DELIMITER //
DROP PROCEDURE IF EXISTS AddFileToFilesDatabase //

CREATE PROCEDURE AddFileToFilesDatabase(
    `@User_Id` INT,
    `@PathName` VARCHAR(255),
    `@Url` VARCHAR(255),
    `@EncryptionType` VARCHAR(25),
    `@FileType` VARCHAR(5),
    `@Size` INT,
    `@DateAdded` DATETIME,
    `@PermissionType` VARCHAR(10)
)
BEGIN
	START TRANSACTION;
    INSERT INTO files(User_Id, PathName, Url, EncryptionType, FileType, Size, DateAdded)
        VALUES(`@User_Id`, `@PathName`, `@Url`, `@EncryptionType`, `@FileType`, `@Size`, `@DateAdded`);
    INSERT INTO permissions(User_Id, PermissionType)
        VALUES(`@User_Id`, `@PermissionType`);
END //
DELIMITER ;
DELIMITER //
DROP PROCEDURE IF EXISTS UpdateFilePermission //

CREATE PROCEDURE UpdateFilePermission(
    `@File_Id` INT,
    `@PermissionType` VARCHAR(10)
)
BEGIN
    START TRANSACTION;
	UPDATE permissions SET PermissionType=`@PathName` WHERE File_Id=`@File_Id`;
END //
DELIMITER ;
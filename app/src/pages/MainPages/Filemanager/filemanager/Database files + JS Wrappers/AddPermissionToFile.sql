DELIMITER //
DROP PROCEDURE IF EXISTS AddPermissionToFile //

CREATE PROCEDURE AddPermissionToFile(
    `@File_Id` INT,
    `@User_Id` INT,
    `@PermissionType` VARCHAR(10)
)
BEGIN
    START TRANSACTION;
		INSERT INTO permissions(File_Id, User_Id, PermissionType)
			VALUES(`@File_Id`, `@User_Id`, `@PermissionType`);
END //
DELIMITER ;

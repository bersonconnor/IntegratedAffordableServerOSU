DELIMITER //
DROP PROCEDURE IF EXISTS DeleteFilePermission //

CREATE PROCEDURE DeleteFilePermission(
    `@File_Id` INT,
    `@User_Id` INT
)
BEGIN
    START TRANSACTION;
		DELETE FROM permissions WHERE File_Id=`@File_Id` AND User_Id=`@User_Id`;
END //
DELIMITER ;
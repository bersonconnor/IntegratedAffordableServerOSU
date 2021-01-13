DELIMITER //
DROP PROCEDURE IF EXISTS UpdateFileFilePath //

CREATE PROCEDURE UpdateFileFilePath(
    `@File_Id` INT,
    `@PathName` VARCHAR(255),
)
BEGIN
    START TRANSACTION;
	UPDATE files SET PathName=`@PathName` WHERE File_Id=`@File_Id`;
END //
DELIMITER ;
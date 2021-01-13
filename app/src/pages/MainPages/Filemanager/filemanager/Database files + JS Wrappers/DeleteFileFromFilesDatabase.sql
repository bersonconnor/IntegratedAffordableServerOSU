DROP PROCEDURE IF EXISTS DeleteFileFromFilesDatabase //

CREATE PROCEDURE DeleteFileFromFilesDatabase(
    `@File_Id` INT
)
BEGIN
	START TRANSACTION;
	DELETE FROM permissions WHERE File_Id=`@File_Id`;
	DELETE FROM encryptions WHERE File_Id=`@File_Id`;
	DELETE FROM files WHERE File_Id=`@File_Id`;
END //
DELIMITER ;
-- Active: cc5002:@localhost/tarea2

-- Crear usuario
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';

-- Eliminar usuario de ser necesario
DROP USER 'cc5002'@'localhost';

-- Otorgar todos los privilegios al usuario cc5002 en la base de datos tarea2
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';

-- No olvides actualizar los privilegios
FLUSH PRIVILEGES;
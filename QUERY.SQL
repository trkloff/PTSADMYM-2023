--crear base de datos mym
CREATE DATABASE mym;

--crear tabla repuesto
CREATE TABLE repuesto(
	ID int primary key,
	DESCRIPCION varchar(100),
	CODIGO_REPUESTO varchar(30),
	PRECIO_ESTIMADO decimal(10,2),
	PRECIO_BASE decimal(10,2)
);

--recuperar el precio mínimo
SELECT MIN(precio_base) as precio_min  FROM repuesto;

--recuperar el precio máximo
SELECT MAX(precio_base) as precio_max  FROM repuesto;

--recuperar un registro por nombre
SELECT * FROM repuesto WHERE descripcion = 'Sensor';

import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    password: 'Eulogia2020',
    port: '3306',
    database: 'ecommercedb'
};

// Crear una conexión única y exportarla
export const connection = await mysql.createConnection(config);
import {connection} from './db.js'
import bcrypt from 'bcrypt';

export class UserModel{
    static async getAll(){
        const [Users] = await connection.query(`
            SELECT name, email, idNationality, password, BIN_TO_UUID(idUser) AS idUser
            FROM user
        `)
        if (Users.length === 0){
            return null
        }
        return Users
    }
    static async getById({id}){
        const [user] = await connection.query(`
            SELECT name, email, password, BIN_TO_UUID(idUser) AS idUser,idNationality 
            FROM user
            WHERE idUser = UUID_TO_BIN(?)
            `, [id])
        if(user.lenght === 0){
            return null
        }
        return user[0]
    }
    static async login({email, password}){
        const [userExists] = await connection.query(`
            SELECT u.name,u.email, u.password
            FROM user u
            LEFT JOIN nationality n ON u.idNationality = n.idNationality 
            WHERE u.email = ?`,[email]
        )
        if(!userExists || userExists.length === 0){
            return {error: "this user donst exists"}
        }
        const user = userExists[0];
        const isValid = bcrypt.compareSync(password, user.password)
        if(!isValid){
            return {error: "invalid password"}
        }
        return user;
    }
    static async create({ input }) {
        const { name, email, password, idNationality } = input;

        // 📌 Generar un UUID directamente en JavaScript
        const [uuidResult] = await connection.query('SELECT UUID() AS uuid');
        const [{ uuid }] = uuidResult;

        // 📌 Verificar si el usuario ya existe
        const [existingUser] = await connection.query(
            `SELECT email FROM user WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return { error: 'This user already exists' };
        }

        try {
            // 📌 Hashear la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10); // 🔹 Salt = 10

            // 📌 Insertar el usuario con la contraseña encriptada
            await connection.query(
                `INSERT INTO user(idUser, name, email, password, idNationality)
                 VALUES(UUID_TO_BIN(?), ?, ?, ?, ?)`,
                [uuid, name, email, hashedPassword, idNationality]
            );

            // 📌 Consultar el usuario recién creado
            const [users] = await connection.query(
                `SELECT name, email, idNationality, BIN_TO_UUID(idUser) AS idUser
                 FROM user WHERE idUser = UUID_TO_BIN(?)`,
                [uuid]
            );

            return users[0];
        } catch (e) {
            console.error('Error during user creation:', e);
            throw new Error(`Error creating user: ${e.message}`);
        }
    }
    static async deleteById({id}){
        try{
            const userExists = await connection.query(`
                SELECT *
                FROM user
                WHERE idUser = UUID_TO_BIN(?)`,[id]
            ) 
            if(!userExists || userExists.length === 0){
                return {error: true, message : 'this  user dosnt exists'}
            }

            await connection.query(`
                DELETE FROM user 
                WHERE idUser = UUID_TO_BIN(?)`,[id])
            
            return {message: 'The delete its succesfully'}
        }
        catch(e){
            console.error('Error during deletion:', e);
            throw new Error(`Error deleting user: ${e.message}`);

        }
    }
    static async patchById({ id, input }) {
        const [result] = await connection.query(`
            UPDATE user
            SET 
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                password = COALESCE(?, password),
                idNationality = COALESCE(?, idNationality)
            WHERE idUser = UUID_TO_BIN(?)
        `, [input.name, input.email, input.password, input.idNationality, id]);
    
        if (result.affectedRows === 0) {
            return null; // No se encontró el producto
        }
    
        // Retornar el producto actualizado
        const [updatedUser] = await connection.query(`
            SELECT name, email, password, idNationality, BIN_TO_UUID(idUser) AS idUser
            FROM user WHERE idUser = UUID_TO_BIN(?)
        `, [id]);
    
        return updatedUser[0];
    }
}
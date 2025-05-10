import { connection } from './db.js'; // Importar la conexión

export class NationalityModel{
    static async getAll(){
        const [nationality] = await connection.query('SELECT * FROM nationality')
        
        if(nationality.length === 0){
            return {message: "any country in the database"}
        }

        return(nationality)
    }
    static async getById({id}){
        const [nationality] = await connection.query(`
            SELECT * 
            FROM nationality 
            WHERE idNationality = ? 
            `,[id])
        if(nationality.length === 0){
            return {message: "country not founded"}
        }

        return nationality[0]
    }
    static async create({country}){
        
        const [countryExisted] = await connection.query(`
            SELECT * 
            FROM nationality
            WHERE country = ?
            `,[country])

        if(countryExisted.length > 0){
            return {message: "the country already exists"}
        }
        
        try {
            await connection.query(`
            INSERT INTO nationality(country)
                VALUES(?)
            `,[country])
        }
        catch(e){
            console.error('Error during nationality creation:', e)
            throw new Error(`Error creating nationality: ${e.message}`)
        }
        const [countryCreated] = await connection.query(`
            SELECT *
            FROM nationality
            WHERE country = ?
            `, [country])

        return countryCreated[0]
    }
    static async deleteById({id}){
        const alreadyDeleted = await connection.query(`
            SELECT * 
            FROM nationality
            WHERE idNationality = ?
            `,[id])
        
        if(alreadyDeleted.length === 0){
            return {message: "this country dosnt exist"}
        }
        
        try{
            await connection.query(`
            DELETE FROM nationality 
            WHERE idNationality = ?
            `,[id])
            
            return {message: "deleting succesfully"}
        }
        catch (e) {
            console.error('Error during deletion:', e);
            throw new Error(`Error deleting country: ${e.message}`);
        }
    }
    static async patchById({ id, country }) {
        const [result] = await connection.query(`
            UPDATE nationality
            SET country = COALESCE(?, country)
            WHERE idNationality = ?
        `, [country ,id]);
    
        if (result.affectedRows === 0) {
            return null;
        }
    
        // Retornar el producto actualizado
        const [updatedNationality] = await connection.query(`
            SELECT *
            FROM nationality 
            WHERE idNationality = ?
        `, [id]);
    
        return updatedNationality[0];
    }
}
import { connection } from './db.js'; // Importar la conexión

export class ProductModel{
    static async getAll(){
        const [products] = await connection.query('SELECT name, description, price, stock, BIN_TO_UUID(idProduct) AS idProduct FROM product')
        
        return(products)
    }

    static async getById({ id }) {
        const [product] = await connection.query('SELECT name, BIN_TO_UUID(idProduct) AS idProduct, stock, description, price FROM product WHERE idProduct = UUID_TO_BIN(?)', [id]);
        
        if (product.length === 0) {
            return null;
        }
        console.log(product);
        return product[0];
    }

    
    static async create({input}){
        const {
            name,
            stock,
            description,
            price
        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid')

        const [{uuid}] = uuidResult
        
        const [existingProducts] = await connection.query(`
            SELECT name FROM product WHERE name = ? 
        `, [name]);
    
        if (existingProducts.length > 0) {
            return { error: 'This product already exists' };
        }

        try{
            await connection.query(`
                INSERT INTO product(idProduct,name,stock,description,price)
                VALUES(UUID_TO_BIN(?),?,?,?,?)`,
                [uuid,name,stock,description,price])
            
            const [products] = await connection.query(`
                SELECT name, stock, description, price, BIN_TO_UUID(idProduct) AS idProduct
                FROM product 
                WHERE idProduct = UUID_TO_BIN(?)
            `,[uuid])

            return products[0]
        }
        catch(e){
            console.error('Error during product creation:', e)
            throw new Error(`Error creating product: ${e.message}`)
        }
    }
    static async deleteById({ id }) {
        // Buscar el producto antes de eliminarlo
        const [product] = await connection.query(`
            SELECT name, description, stock, price, BIN_TO_UUID(idProduct) AS idProduct
            FROM product
            WHERE idProduct = UUID_TO_BIN(?)
        `, [id]);
    
        // Si el array está vacío, el producto no existe
        if (product.length === 0) {
            return { error: 'This product does not exist' };
        }
    
        try {
            // Eliminar el producto
            await connection.query(`
                DELETE FROM product
                WHERE idProduct = UUID_TO_BIN(?)
            `, [id]);
    
            return { message: 'Product deleted successfully' };
        } catch (e) {
            console.error('Error during deletion:', e);
            throw new Error(`Error deleting product: ${e.message}`);
        }
    }
    static async patchById({ id, input }) {
        const [result] = await connection.query(`
            UPDATE product
            SET 
                name = COALESCE(?, name),
                stock = COALESCE(?, stock),
                description = COALESCE(?, description),
                price = COALESCE(?, price)
            WHERE idProduct = UUID_TO_BIN(?)
        `, [input.name, input.stock, input.description, input.price, id]);
    
        if (result.affectedRows === 0) {
            return null; // No se encontró el producto
        }
    
        // Retornar el producto actualizado
        const [updatedProduct] = await connection.query(`
            SELECT name, description, stock, price, BIN_TO_UUID(idProduct) AS idProduct
            FROM product WHERE idProduct = UUID_TO_BIN(?)
        `, [id]);
    
        return updatedProduct[0];
    }
}
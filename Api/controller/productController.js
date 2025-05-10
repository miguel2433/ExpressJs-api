import { productValidate } from '../schema/productScheme.js'
import { validatePartialProduct } from '../schema/productScheme.js'

export class ProductController{
    constructor ({productModel}) {
        this.productModel = productModel
    }

    getAll = async (req,res) =>{
        try {
            const products = await this.productModel.getAll()
            if (!products) {
                return res.status(404).json({ error: 'No products found' })
            }
            res.json(products)
        } catch (error) {
            console.error('Error fetching products:', error)
            res.status(500).json({ error: 'Error fetching products' })
        }
    }
    getById = async (req,res) => {
        try{
            const { id } = req.params
            const product = await this.productModel.getById({id})
            if (!product) {
                return res.status(404).json({ error: 'Any product by id found' })
            }
            res.json(product)
        }
        catch (error) {
            console.error('Error fetching products:', error)
            res.status(500).json({ error: 'Error fetching products' })
        }
    }
    create = async (req, res) => {
        try {
            // Verificar si los datos existen en req.body
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is required' });
            }
    
            // Validar los datos con Zod
            const validationResult = productValidate(req.body);
    
            // Si la validación falla, retornar un error detallado
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors,
                });
            }
    
            // Extraer los datos validados
            let { name, stock, description, price } = validationResult.data;
            
            price = parseFloat(price.toFixed(2));
            // Crear el producto en la base de datos
            const newProduct = await this.productModel.create({ input: { name, stock, description, price } });
    
            // Responder con el producto recién creado
            res.status(201).json(newProduct);
        } catch (e) {
            console.error('Error during product creation:', e);
            throw new Error('Error creating product');
        }
    }
    deleteById = async (req, res) => {
        try {
            const { id } = req.params;
    
            const deletedProduct = await this.productModel.deleteById({ id });
    
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
    
            res.status(201).json(deletedProduct);;
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Error deleting product' });
        }
    }
    patchById = async (req, res) => {
        try {
            // 📌 1️⃣ Extraer el ID del producto desde req.params
            const { id } = req.params;
    
            // 📌 2️⃣ Verificar si el cuerpo de la solicitud existe y no está vacío
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is required' });
            }
    
            // 📌 3️⃣ Validar los datos con Zod
            const validationResult = validatePartialProduct(req.body);
    
            // 📌 4️⃣ Si la validación falla, retornar un error detallado
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors,
                });
            }
    
            // 📌 5️⃣ Extraer los datos validados
            const { name, stock, description, price } = validationResult.data;
    
            // 📌 6️⃣ Llamar a la función de actualización en el modelo
            const updatedProduct = await this.productModel.patchById({ id, input: { name, stock, description, price } });
    
            // 📌 7️⃣ Verificar si el producto existe
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
    
            // 📌 8️⃣ Responder con el producto actualizado
            return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    
        } catch (e) {
            console.error('Error updating product:', e);
            res.status(500).json({ error: 'Error updating product' });
        }
    };
    
}

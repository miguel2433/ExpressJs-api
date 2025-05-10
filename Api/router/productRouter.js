import { Router } from 'express';
import { ProductController } from '../controller/productController.js';

export const CreateProductRouter = ({ productModel }) => {
    const ProductRouter = Router();

    // Crear una instancia del controlador pasando el modelo
    const productController = new ProductController({ productModel });

    // Definir rutas
    ProductRouter.get('/', productController.getAll);
    ProductRouter.get('/:id', productController.getById);
    ProductRouter.post('/', productController.create);
    ProductRouter.delete('/:id', productController.deleteById);
    ProductRouter.patch('/:id', productController.patchById);

    return ProductRouter;
}
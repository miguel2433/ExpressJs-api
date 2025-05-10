import { Router } from 'express';
import { NationalityController } from '../controller/nationalityController.js'; 

export const CreateNationalityRouter = ({ nationalityModel }) => {
    const NationalityRouter = Router();

    // Crear una instancia del controlador pasando el modelo
    const nationalityController = new NationalityController({ nationalityModel });

    // Definir rutas
    NationalityRouter.get('/', nationalityController.getAll);
    NationalityRouter.get('/:id', nationalityController.getById);
    NationalityRouter.post('/', nationalityController.create);
    NationalityRouter.delete('/:id', nationalityController.deleteById);
    NationalityRouter.patch('/:id', nationalityController.patchById);
    
    return NationalityRouter;
}
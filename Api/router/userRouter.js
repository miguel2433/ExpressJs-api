import { Router } from 'express';
import { UserController } from '../controller/userControler.js'; 

export const CreateUserRouter = ({ userModel }) => {
    const UserRouter = Router();

    // Crear una instancia del controlador pasando el modelo
    const userController = new UserController({ userModel });

    // Definir ruta
    UserRouter.get('/', userController.getAll);
    UserRouter.get('/:id', userController.getById);
    UserRouter.post('/register', userController.create);
    UserRouter.post('/login', userController.login);
    UserRouter.patch('/:id', userController.patchById);
    UserRouter.delete("/:id", userController.deleteById);
    
    return UserRouter;
}
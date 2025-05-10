import { ValidateUser } from "../schema/userScheme.js"
import { ValidatePartialUser } from "../schema/userScheme.js"
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../config.js"; 



export class UserController{
    constructor ({userModel}) {
        this.userModel = userModel}
        getAll = async (req,res) =>{
            try {
                const users = await this.userModel.getAll()
                if (!users) {
                    return res.status(404).json({ error: 'No users found' })
                }
                res.json(users)
            } catch (error) {
                console.error('Error fetching users:', error)
                res.status(500).json({ error: 'Error fetching users' })
            }
        }
        getById = async (req,res) => {
            try{
                const { id } = req.params
                const user = await this.userModel.getById({id})
                if (!user) {
                    return res.status(404).json({ error: 'Any user by id found' })
                }
                res.json(user)
            }
            catch (error) {
                console.error('Error fetching user:', error)
                res.status(500).json({ error: 'Error fetching user' })
            }
        }

        create = async (req, res) => {
        try{
           if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({error: "request body is required"});
           } 
           
           const ValidationResult = ValidateUser(req.body)

           if(!ValidationResult.success){
                return res.status(400).json({
                    error: 'Validation failed',
                    details: ValidationResult.error.errors,
            });
            }
            let { name, email, password, idNationality } = ValidationResult.data;

            console.log(ValidationResult.data)

            const newUser = await this.userModel.create({input : {name, email, password, idNationality}})
        
            res.status(201).json(newUser);
        }
        catch(error){
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
    login = async (req, res) => {
        try {
          if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "request body is required" });
          }
      
          const { email, password } = req.body;
          const user = await this.userModel.login({ email, password });
          const token = jwt.sign({email: user.email, name:user.name}, SECRET_KEY, { expiresIn: '1h' });
          if (user.error) {
            return res.status(401).json({ error: user.error });
          }
      
          return res.cookie('acces_token', token,{
            httpOnly: true,
            sameSite:'strict',
            maxAxe: 1000 * 60 * 60
          }).status(200).json({ message: "Login successful", user, token });

      
        } catch (error) {
          console.error("Error en login:", error); // Agregá esto para ver detalles en consola
          res.status(500).json({ error: 'Error login user' });
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
            const validationResult = ValidatePartialUser(req.body);
    
            // 📌 4️⃣ Si la validación falla, retornar un error detallado
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors,
                });
            }
    
            // 📌 5️⃣ Extraer los datos validados
            const { name, email, idNationality, password } = validationResult.data;
    
            // 📌 6️⃣ Llamar a la función de actualización en el modelo
            const updatedUser = await this.userModel.patchById({ id, input: { name, email, password, idNationality } });
    
            // 📌 7️⃣ Verificar si el producto existe
            if (!updatedUser) {
                return res.status(404).json({ error: 'user not found' });
            }
    
            // 📌 8️⃣ Responder con el producto actualizado
            return res.status(200).json({ message: 'user updated successfully', user: updatedUser });
    
        } catch (e) {
            console.error('Error updating user:', e);
            res.status(500).json({ error: 'Error updating user' });
        }
    };
    deleteById = async (req,res) =>{
        try{
            const { id } = req.params;
            
            // 📌 6️⃣ Llamar a la función de actualización en el modelo
            const deletedUser = await this.userModel.deleteById({ id });
        
            // 📌 7️⃣ Verificar si el usuario existe
            if (!deletedUser) {
                return res.status(404).json({ error: 'user not found' });
            }
        
            // 📌 8️⃣ Responder con el user actualizado
            return res.status(200).json({ message: 'user deleted successfully'});
            
            } catch (e) {
                console.error('Error deleteing user:', e);
                res.status(500).json({ error: 'Error deleting user' });
            }
        };
}
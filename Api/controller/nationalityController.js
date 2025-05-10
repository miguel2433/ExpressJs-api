import { nationalityValidate } from "../schema/nationalityScheme.js";

export class NationalityController{
    constructor ({ nationalityModel }) {
        this.nationalityModel = nationalityModel
    }
    getAll = async (req, res) => {
        try {
            const nationalitys = await this.nationalityModel.getAll()
            if (!nationalitys) {
                return res.status(404).json({ error: 'No nationalitys found' })
            }
            res.json(nationalitys)
        } catch (error) {
            console.error('Error fetching nationalitys:', error)
            res.status(500).json({ error: 'Error fetching nationalitys' })
        }
    }
    getById = async (req,res) => {
        try{
            const { id } = req.params
            const nationalityById = await this.nationalityModel.getById({id})
            if (!nationalityById) {
                return res.status(404).json({ error: 'Any nationality by id found' })
            }
            res.json(nationalityById)
        }
        catch (error) {
            console.error('Error fetching nationality:', error)
            res.status(500).json({ error: 'Error fetching nationality' })
        }
    }
    create = async (req, res) => {
        try {
            // Verificar si los datos existen en req.body
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is required' });
            }
    
            // Validar los datos con Zod
            const validationResult = nationalityValidate(req.body);
    
            // Si la validación falla, retornar un error detallado
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors,
                });
            }
    
            // Extraer los datos validados
            let { country } = validationResult.data;
            // Crear el producto en la base de datos
            const newCountry = await this.nationalityModel.create({ country });
    
            // Responder con el producto recién creado
            res.status(201).json(newCountry);
        } catch (e) {
            console.error('Error during country creation:', e);
            throw new Error('Error creating country');
        }
    }
    deleteById = async (req, res) => {
        try {
            const { id } = req.params;
    
            const deletedNationality = await this.nationalityModel.deleteById({ id });
    
            if (!deletedNationality) {
                return res.status(404).json({ error: 'country not found' });
            }
    
            res.status(201).json(deletedNationality);;
        } catch (error) {
            console.error('Error deleting country:', error);
            res.status(500).json({ error: 'Error deleting country' });
        }    
    }
    patchById = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is required' });
            }
    
            // 📌 Validar los datos con Zod
            const validationResult = nationalityValidate(req.body);
    
            // 📌 Si la validación falla, retornar un error detallado
            if (!validationResult.success) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: validationResult.error.errors,
                });
            }
    
            // 📌 Extraer los datos validados
            const { country } = validationResult.data;
    
            // 📌 Extraer el ID desde params
            const { id } = req.params;
    
            // 📌 Intentar actualizar el registro en la base de datos
            const patchedCountry = await this.nationalityModel.patchById({ id, country });
    
            // 📌 Si no se encontró el país, devolver un error 404
            if (patchedCountry === null) {
                return res.status(404).json({ error: 'Country not found' });
            }
    
            // 📌 Responder con el país actualizado
            res.status(200).json(patchedCountry);
        } catch (error) {
            console.error('Error updating country:', error);
            res.status(500).json({ error: 'Error updating country' });
        }
    };
    
}
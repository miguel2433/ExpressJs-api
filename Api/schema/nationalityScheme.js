import { z } from 'zod'; // Asegúrate de que la ruta sea correcta

const productSchema = z.object({
    country: z.string({
        invalid_type_error: 'country must be a string',
        required_error: 'the name of the country is required'
    }).max(45,{message: 'the country must be at most 45 characters long '})
})

export function nationalityValidate(object){
    return productSchema.safeParse(object)
}

export function validatePartialNationality(object){
    return productSchema.partial().safeParse(object)
}
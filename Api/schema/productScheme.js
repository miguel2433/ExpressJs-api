import { z } from 'zod'; // Asegúrate de que la ruta sea correcta

const productSchema = z.object({
    name: z.string({
        invalid_type_error: 'product name must be a string',
        required_error: 'product name is required'
        }).max(45, { message: 'product name must be at most 45 characters long' }),
    stock: z.number().int().min(0).max(1000),
    description: z.string({
        invalid_type_error: 'product description must be a string',
        required_error: 'product description is required'}),
    price: z.number({
        required_error: 'the price of the product is required'
    }).refine(value => /^\d+(\.\d{1,2})?$/.test(value.toString()), {
        message: 'product price must be a decimal with up to 2 decimal places'
    })
        
})

export function productValidate(object){
    return productSchema.safeParse(object)
}

export function validatePartialProduct(object){
    return productSchema.partial().safeParse(object)
}
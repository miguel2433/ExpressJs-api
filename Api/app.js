import express from 'express';
import cors from 'cors'; // Importa el paquete cors
import { CreateProductRouter } from './router/productRouter.js';
import { CreateNationalityRouter } from './router/nationalityRouter.js';
import { ProductModel } from './local-fyle-system/mysql/productModel.js';
import { NationalityModel } from './local-fyle-system/mysql/nationalityModel.js';
import { CreateUserRouter } from './router/userRouter.js';
import { UserModel } from './local-fyle-system/mysql/userModel.js';
import cookieParser from "cookie-parser";
import SECRET_KEY from "./config.js"

const app = express();

app.disable('x-powered-by');

// Usa cors para permitir todos los orígenes
app.use(cors());

app.use(cookieParser());

// Agrega el middleware para procesar JSON
app.use(express.json());
app.use((req,res,next) => {
    const token = req.cookies.acces_token
    let data = null

    req.session = {user : null}
    try{
        data = jwt.verify(token, SECRET_KEY)
        req.session.user = data
    }
    catch(error){
        req.session.user = null
    }

    next()
})
app.use('/user', CreateUserRouter({ userModel: UserModel }))
app.use('/product', CreateProductRouter({ productModel: ProductModel }));
app.use('/nationality', CreateNationalityRouter({ nationalityModel: NationalityModel}))

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});
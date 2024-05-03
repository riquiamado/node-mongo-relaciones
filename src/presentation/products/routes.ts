import { Router } from "express";
import {  ProductController } from "./controllers";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { ProductService } from "../services/product.services";



export class ProductRoutes {
    static get routes():Router{
        const router = Router()
         const productService = new ProductService()
        const controllers = new ProductController(productService)

        router.get('/',controllers.getProducts)
        // router.get('/:id',controllers.getCategoryById)
        router.post('/',[AuthMiddleware.validateJWT],controllers.createProduct)
        // router.get('/:id',controllers.updateCategory)
        // router.get('/:id',controllers.deletCategory)


        return router;
    }
}
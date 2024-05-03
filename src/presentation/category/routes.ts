import { Router } from "express";
import { CategoryController } from "./controllers";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { CategoryService } from "../services/category.services";



export class CategoryRoutes {
    static get routes():Router{
        const router = Router()
        const categoryService = new CategoryService()
        const controllers = new CategoryController(categoryService)

        router.get('/',controllers.getCategories)
        // router.get('/:id',controllers.getCategoryById)
        router.post('/',[AuthMiddleware.validateJWT],controllers.createCategory)
        // router.get('/:id',controllers.updateCategory)
        // router.get('/:id',controllers.deletCategory)


        return router;
    }
}
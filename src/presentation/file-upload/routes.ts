import { Router } from "express";
import { FileUploadController } from "./controllers";
import { FileUploadService } from "../services";
import { FileUploadMiddlewares } from "../middlewares/file-upload.middlewares";



export class FileUploadRoutes {
    static get routes():Router{
        const router = Router()
        const fileServices = new FileUploadService()
        const controllers = new FileUploadController(fileServices)

        router.use(FileUploadMiddlewares.containesFiles)

        router.post('/single/:type',controllers.uploadFiles)
        // router.get('/:id',controllers.getCategoryById)
        router.post('/multiple/:type',controllers.uploadMultipleFiles)
        // router.get('/:id',controllers.updateCategory)
        // router.get('/:id',controllers.deletCategory)


        return router;
    }
}
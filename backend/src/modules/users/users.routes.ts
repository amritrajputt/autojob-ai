import { Router } from "express";
import { UsersController } from "./users.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";

const usersRouter: Router = Router();

// Apply authMiddleware to protect all user routes
usersRouter.use(authMiddleware);

usersRouter.get('/me', UsersController.getMe);
usersRouter.put('/me', UsersController.updateMe);
usersRouter.get('/plan', UsersController.getActivePlan);

export { usersRouter };
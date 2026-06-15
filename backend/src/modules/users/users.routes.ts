import { Router } from "express";
import { UsersController } from "./users.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { userSchema } from "./users.dto.js";

const usersRouter: Router = Router();

// Apply authMiddleware to protect all user routes
usersRouter.use(authMiddleware);

usersRouter.get('/me', UsersController.getMe);
usersRouter.patch('/me', validateBody(userSchema), UsersController.updateMe);
usersRouter.get('/plan', UsersController.getActivePlan);

export { usersRouter };
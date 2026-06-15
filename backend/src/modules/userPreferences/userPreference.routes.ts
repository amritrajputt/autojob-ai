import { Router } from "express";
import { UserPreferenceController } from "./userPreference.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { userPreferenceSchema, updateUserPreferenceSchema } from "./userPreference.dto.js";

const userPreferenceRouter: Router = Router();
userPreferenceRouter.use(authMiddleware);

userPreferenceRouter.post("/createpreference", validateBody(userPreferenceSchema), UserPreferenceController.createPreference);
userPreferenceRouter.get("/getpreference", UserPreferenceController.getUserPreferences);
userPreferenceRouter.patch("/updatepreference", validateBody(updateUserPreferenceSchema), UserPreferenceController.updateUserPreferences);

export { userPreferenceRouter };
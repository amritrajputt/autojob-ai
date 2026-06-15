import { Router } from "express";
import { UserPreferenceController } from "./userPreference.controller.js";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";

const userPreferenceRouter: Router = Router();
userPreferenceRouter.use(authMiddleware);

userPreferenceRouter.post("/createpreference", UserPreferenceController.createPreference);
userPreferenceRouter.get("/getpreference", UserPreferenceController.getUserPreferences);
userPreferenceRouter.patch("/updatepreference", UserPreferenceController.updateUserPreferences);

export { userPreferenceRouter };
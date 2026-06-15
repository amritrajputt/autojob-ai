import {Router} from "express"
import { authMiddleware } from "../../common/middleware/auth.middleware.js"
import { IntegrationController } from "./integration.controller.js"
import { validateBody } from "../../common/middleware/validate.middleware.js"
import { groqKeySchema, cookieSchema } from "./integrations.dto.js"

const integrationRouter:Router = Router();
integrationRouter.use(authMiddleware);

integrationRouter.post("/groq", validateBody(groqKeySchema), IntegrationController.groqIntegration)
integrationRouter.get("/getintegrations",IntegrationController.getIntegrations)
integrationRouter.delete("/deletegroqkey",IntegrationController.deleteGroq)
integrationRouter.post("/cookie/:platform(linkedin|naukri|internshala)", validateBody(cookieSchema), IntegrationController.addCookie)
integrationRouter.get("/cookie/:platform(linkedin|naukri|internshala)",IntegrationController.getCookie)
integrationRouter.delete("/cookie/:platform(linkedin|naukri|internshala)",IntegrationController.deleteCookie)
integrationRouter.get("/cookie/:platform(linkedin|naukri|internshala)/status",IntegrationController.getCookieStatus)

export {integrationRouter}

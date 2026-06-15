import {Router} from "express";
import {ResumeController} from "./resume.controller.js";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { upload } from "../../common/middleware/upload.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import { resumeSchema, updateResumeSchema } from "./resume.dto.js";

const resumeRouter:Router = Router();

resumeRouter.use(authMiddleware);
// remember front need this :<input type="file" name="resume" />
resumeRouter.post('/uploadresume', upload.single('resume'), validateBody(resumeSchema), ResumeController.uploadResume);
resumeRouter.get('/getresumes', ResumeController.getResumes);
resumeRouter.delete('/deleteresume/:id', ResumeController.deleteResume);
resumeRouter.patch('/updateresumelabel/:id', validateBody(updateResumeSchema), ResumeController.updateResumeLabels);

export { resumeRouter };
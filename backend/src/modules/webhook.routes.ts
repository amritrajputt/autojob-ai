import { Router } from "express";
import { WebhookController } from "./webhook.controller.js";

const webhookRouter:Router = Router();

// This is the webhook route which will receive webhooks from Clerk.
// Since this router is mounted at "/webhooks", the full URL is /webhooks/clerk
webhookRouter.post('/clerk', WebhookController.handleWebhook);

export {webhookRouter };

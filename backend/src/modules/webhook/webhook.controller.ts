import type { Request, Response } from 'express';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/express';
import { WebhookService } from './webhook.service.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';

class WebhookController {
     static async handleWebhook(req: Request, res: Response): Promise<any> {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            throw ApiError.unAuthorized("No webhook secret is set");
        }

        const svixId = req.headers['svix-id'] as string;
        const svixTimestamp = req.headers['svix-timestamp'] as string;
        const svixSignature = req.headers['svix-signature'] as string;

        if (!svixId || !svixTimestamp || !svixSignature) {
            throw ApiError.badRequest("Missing svix headers");
        }

        let payload = '';
        if (Buffer.isBuffer(req.body)) {
            payload = req.body.toString('utf8');
        } else if (typeof req.body === 'string') {
            payload = req.body;
        } else {
            payload = JSON.stringify(req.body);
        }

        let event: any;
        try {
            const wh = new Webhook(webhookSecret);
            event = wh.verify(payload, {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            }) as WebhookEvent;
        } catch (err: any) {
            console.error('[Webhook] Signature verification failed:', err.message);
            throw ApiError.badRequest("Invalid signature");
        }

        try {
            const eventType = event.type;
            const eventData = event.data;

            switch (eventType) {
                case 'user.created':
                    await WebhookService.createUser(eventData);
                    break;
                case 'user.updated':
                    await WebhookService.updateUser(eventData);
                    break;
                case 'user.deleted':
                    await WebhookService.deleteUser(eventData);
                    break;
                default:
                    console.log(`Unhandled event type: ${eventType}`);
            }

            return ApiResponse.success(res, "Operation successful", { success: true });
        } catch (error: any) {
            console.error(`Error processing webhook event (${event.type}):`, error);
            throw ApiError.internalServerError("Internal server error processing webhook");
        }
    };
}

export { WebhookController };


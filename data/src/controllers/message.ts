import { Hono } from "hono";
import { createKeyMiddleware } from "../middlewares/key.middleware";
import { requestValidator } from "../middlewares/validation.middleware";
import { z } from "zod";
import * as whatsapp from "wa-multi-session";
import { HTTPException } from "hono/http-exception";

export const createMessageController = () => {
  const app = new Hono();

  const sendMessageSchema = z.object({
    session: z.string(),
    to: z.string(),
    text: z.string(),
    is_group: z.boolean().optional(),
  });

  app.post(
    "/send-text",
    createKeyMiddleware(),
    requestValidator("json", sendMessageSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const isExist = whatsapp.getSession(payload.session);
      if (!isExist) {
        throw new HTTPException(400, {
          message: "Session does not exist",
        });
      }

      await whatsapp.sendTyping({
        sessionId: payload.session,
        to: payload.to,
        duration: Math.min(5000, payload.text.length * 100),
        isGroup: payload.is_group,
      });

      const response = await whatsapp.sendTextMessage({
        sessionId: payload.session,
        to: payload.to,
        text: payload.text,
        isGroup: payload.is_group,
      });

      return c.json({
        data: response,
      });
    }
  );

  /**
   * @deprecated
   * This endpoint is deprecated, use POST /send-text instead
   */
  app.get(
    "/send-text",
    createKeyMiddleware(),
    requestValidator("query", sendMessageSchema),
    async (c) => {
      const payload = c.req.valid("query");
      const isExist = whatsapp.getSession(payload.session);
      if (!isExist) {
        throw new HTTPException(400, {
          message: "Session does not exist",
        });
      }

      const response = await whatsapp.sendTextMessage({
        sessionId: payload.session,
        to: payload.to,
        text: payload.text,
      });

      return c.json({
        data: response,
      });
    }
  );

  app.post(
    "/send-image",
    createKeyMiddleware(),
    requestValidator(
      "json",
      sendMessageSchema.merge(
        z.object({
          image_url: z.string(),
        })
      )
    ),
    async (c) => {
      const payload = c.req.valid("json");
      const isExist = whatsapp.getSession(payload.session);
      if (!isExist) {
        throw new HTTPException(400, {
          message: "Session does not exist",
        });
      }

      await whatsapp.sendTyping({
        sessionId: payload.session,
        to: payload.to,
        duration: Math.min(5000, payload.text.length * 100),
        isGroup: payload.is_group,
      });

      const response = await whatsapp.sendImage({
        sessionId: payload.session,
        to: payload.to,
        text: payload.text,
        media: payload.image_url,
        isGroup: payload.is_group,
      });

      return c.json({
        data: response,
      });
    }
  );
  app.post(
    "/send-document",
    createKeyMiddleware(),
    requestValidator(
      "json",
      sendMessageSchema.merge(
        z.object({
          document_url: z.string(),
          document_name: z.string(),
        })
      )
    ),
    async (c) => {
      const payload = c.req.valid("json");
      const isExist = whatsapp.getSession(payload.session);
      if (!isExist) {
        throw new HTTPException(400, {
          message: "Session does not exist",
        });
      }

      await whatsapp.sendTyping({
        sessionId: payload.session,
        to: payload.to,
        duration: Math.min(5000, payload.text.length * 100),
        isGroup: payload.is_group,
      });

      const response = await whatsapp.sendDocument({
        sessionId: payload.session,
        to: payload.to,
        text: payload.text,
        media: payload.document_url,
        filename: payload.document_name,
        isGroup: payload.is_group,
      });

      return c.json({
        data: response,
      });
    }
  );

  app.post(
    "/send-sticker",
    createKeyMiddleware(),
    requestValidator(
      "json",
      sendMessageSchema.merge(
        z.object({
          image_url: z.string(),
        })
      )
    ),
    async (c) => {
      const payload = c.req.valid("json");
      const isExist = whatsapp.getSession(payload.session);
      if (!isExist) {
        throw new HTTPException(400, {
          message: "Session does not exist",
        });
      }

      const response = await whatsapp.sendSticker({
        sessionId: payload.session,
        to: payload.to,
        media: payload.image_url,
        isGroup: payload.is_group,
      });

      return c.json({
        data: response,
      });
    }
  );

  return app;
};

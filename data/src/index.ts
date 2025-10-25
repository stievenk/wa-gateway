import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import moment from "moment";
import { globalErrorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notfound.middleware";
import { serve } from "@hono/node-server";
import { env } from "./env";
import { createSessionController } from "./controllers/session";
import * as whastapp from "wa-multi-session";
import { createMessageController } from "./controllers/message";
import { CreateWebhookProps } from "./webhooks";
import { createWebhookMessage } from "./webhooks/message";
import { createWebhookSession } from "./webhooks/session";
import { createProfileController } from "./controllers/profile";
import { createWebhookContact } from "./webhooks/contact";
import { serveStatic } from "@hono/node-server/serve-static";
import { toDataURL } from "qrcode";

const app = new Hono();

app.use(
  logger((...params) => {
    params.map((e) => console.log(`${moment().toISOString()} | ${e}`));
  })
);
app.use(cors());

app.onError(globalErrorMiddleware);
app.notFound(notFoundMiddleware);

/**
 * serve media message static files
 */
app.use(
  "/media/*",
  serveStatic({
    root: "./",
  })
);

/**
 * session routes
 */
app.route("/session", createSessionController());
/**
 * message routes
 */
app.route("/message", createMessageController());
/**
 * profile routes
 */
app.route("/profile", createProfileController());

// const port = env.PORT;
const port = 6060;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

whastapp.onConnected((session) => {
  console.log(`session: '${session}' connected`);
});

// const WEBHOOK_BASE_URL = env.WEBHOOK_BASE_URL;
const WEBHOOK_BASE_URL = 'http://192.168.172.117:9000/whatsapp?command=';
// const WEBHOOK_BASE_URL = 'https://app.photoboothmanado.com/wa.php?command=';
// Implement Webhook
if (WEBHOOK_BASE_URL) {
  const webhookProps: CreateWebhookProps = {
    baseUrl: WEBHOOK_BASE_URL,
  };

  // message webhook
  whastapp.onMessageReceived(createWebhookMessage(webhookProps));

  // session webhook
  const webhookSession = createWebhookSession(webhookProps);

  whastapp.onConnected((session) => {
    console.log(`session: '${session}' connected!`);
    webhookSession({ session, status: "connected", qr : null });
  });
  whastapp.onConnecting((session) => {
    console.log(`session: '${session}' connecting!`);
    webhookSession({ session, status: "connecting", qr : null });
  });
  whastapp.onDisconnected((session) => {
    console.log(`session: '${session}' disconnected!`);
    webhookSession({ session, status: "disconnected", qr : null });
  });

  whastapp.onQRUpdated(async (data) => {
    const qr = await toDataURL(data.qr);
    console.log(`session: '${data.sessionId}' qr updated`);
    // console.log(qr);
    webhookSession({ session : data.sessionId, status: "qr-update", qr });
  });

  const webhookContact = createWebhookContact(webhookProps);
  whastapp.onContactUpdate(async (data) => {
    // console.log(data);
    console.log(`session: '${data.sessionId}' contact updated`);
    webhookContact({ session : data.sessionId, contacts : data.contacts });
  });
}
// End Implement Webhook

whastapp.loadSessionsFromStorage();

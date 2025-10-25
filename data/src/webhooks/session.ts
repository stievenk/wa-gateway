import { CreateWebhookProps, webhookClient } from ".";

type SessionStatus = "connected" | "disconnected" | "connecting" | "qr-update";

type WebhookSessionBody = {
  session: string;
  status: SessionStatus;
  qr : string | null;
};

export const createWebhookSession =
  (props: CreateWebhookProps) => async (event: WebhookSessionBody) => {
    const endpoint = `${props.baseUrl}/session`;

    const body = {
      session: event.session,
      status: event.status,
      qr : event.qr || null
    } satisfies WebhookSessionBody;

    webhookClient.post(endpoint, body).catch(console.error);
  };

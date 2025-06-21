import { CreateWebhookProps, webhookClient } from ".";

type WebhookSessionBody = {
  session: string;
  contacts : Object;
};

export const createWebhookContact =
  (props: CreateWebhookProps) => async (event: WebhookSessionBody) => {
    const endpoint = `${props.baseUrl}/contacts`;

    const body = {
      session: event.session,
      contacts : event.contacts,
    } satisfies WebhookSessionBody;

    webhookClient.post(endpoint, body).catch(console.error);
  };
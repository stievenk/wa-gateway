import { MessageReceived } from "wa-multi-session";
import { CreateWebhookProps, webhookClient } from ".";
import {
  handleWebhookAudioMessage,
  handleWebhookDocumentMessage,
  handleWebhookImageMessage,
  handleWebhookVideoMessage,
} from "./media";

type WebhookMessageBody = {
  session: string;
  from: string | null;
  isMe: string | null;
  message: string | null;
  pushName : string | null;
  participant : string | null;
  media: {
    image: string | null;
    video: string | null;
    document: string | null;
    audio: string | null;
    rawdata : string | null;
  };
};

export const createWebhookMessage =
  (props: CreateWebhookProps) => async (message: MessageReceived) => {
  //  if (message.key.fromMe || message.key.remoteJid?.includes("broadcast"))
    if (message.key.remoteJid?.includes("broadcast"))
      return;

    const endpoint = `${props.baseUrl}/message`;

    const image = await handleWebhookImageMessage(message);
    const video = await handleWebhookVideoMessage(message);
    const document = await handleWebhookDocumentMessage(message);
    const audio = await handleWebhookAudioMessage(message);
    const rawdata = JSON.stringify(message);
    const pushName = message.verifiedBizName || message.pushName || null;
    const participant = message.key?.participant || '';
    const isMe = message.key?.fromMe ? 'true' : 'false';

    const body = {
      session: message.sessionId,
      from: message.key.remoteJid ?? null,
      pushName, participant, isMe,
      message:
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        message.message?.imageMessage?.caption ||
        message.message?.videoMessage?.caption ||
        message.message?.documentMessage?.caption ||
        message.message?.contactMessage?.displayName ||
        message.message?.locationMessage?.comment ||
        message.message?.liveLocationMessage?.caption ||
        message.message?.templateMessage?.hydratedTemplate?.hydratedContentText ||
        null,

      /**
       * media message
       */
      media: {
        image,
        video,
        document,
        audio,
	      rawdata
      },
    } satisfies WebhookMessageBody;
    webhookClient.post(endpoint, body).catch(console.error);
  };

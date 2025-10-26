import { MessageReceived } from "wa-multi-session";

const baseMediaPath = "./media/";

export const handleWebhookImageMessage = async (message: MessageReceived) => {
  if (message.message?.imageMessage) {
    const baseMediaName = `${message.key.id}`;

    const fileName = `${baseMediaName}.jpg`;
    await message.saveImage(baseMediaPath + fileName);
    return fileName;
  }
  return null;
};

export const handleWebhookVideoMessage = async (message: MessageReceived) => {
  if (message.message?.videoMessage) {
    const baseMediaName = `${message.key.id}`;

    const fileName = `${baseMediaName}.mp4`;
    await message.saveVideo(baseMediaPath + fileName);
    return fileName;
  }
  return null;
};

export const handleWebhookDocumentMessage = async (
  message: MessageReceived
) => {
  if (message.message?.documentMessage) {
    let fileext = '';
    switch(message.message?.documentMessage?.mimetype) {
      default : fileext = ''; break;
      case 'application/pdf' : fileext = '.pdf'; break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : fileext = '.docx';  break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : fileext = '.xlsx';  break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : fileext = '.pptx';  break;
      case 'application/msword' : fileext = '.doc';  break;
      case 'application/vnd.ms-excel' : fileext = '.xls';  break;
      case 'application/vnd.ms-powerpoint' : fileext = '.ppt'; break;
      case 'application/zip' : fileext = '.zip'; break;
      case 'application/x-7z-compressed' : fileext = '.7z'; break;
      case 'application/x-rar-compressed' : fileext = '.rar'; break;
      case 'application/x-tar' : fileext = '.tar'; break;
      case 'application/gzip' : fileext = '.gz'; break;
      case 'application/x-bzip2' : fileext = '.bz2'; break;
      case 'application/x-xz' : fileext = '.xz'; break;
      case 'application/x-lzip' : fileext = '.lz'; break;
      case 'application/x-lzma' : fileext = '.lzma'; break;
      case 'application/x-lzop' : fileext = '.lzop'; break;
      case 'image/jpeg' : fileext = '.jpg'; break;
      case 'image/png' : fileext = '.png'; break;
      case 'image/gif' : fileext = '.gif'; break;
      case 'image/bmp' : fileext = '.bmp'; break;
      case 'image/tiff' : fileext = '.tiff'; break;
      case 'image/webp' : fileext = '.webp'; break;
      case 'audio/mpeg' : fileext = '.mp3'; break;
      case 'audio/ogg' : fileext = '.ogg'; break;
      case 'audio/wav' : fileext = '.wav'; break;
      case 'audio/flac' : fileext = '.flac'; break;
      case 'audio/aac' : fileext = '.aac'; break;
      case 'audio/midi' : fileext = '.midi'; break;
      case 'audio/x-midi' : fileext = '.midi'; break;
      case 'audio/x-wav' : fileext = '.wav'; break;
      case 'video/mp4' : fileext = '.mp4'; break;
      case 'video/webm' : fileext = '.webm'; break;
      case 'video/ogg' : fileext = '.ogg'; break;
      case 'video/quicktime' : fileext = '.mov'; break;
      case 'video/x-msvideo' : fileext = '.avi'; break;
      case 'video/x-matroska' : fileext = '.mkv'; break;
      case 'video/x-flv' : fileext = '.flv'; break;
      case 'video/x-ms-wmv' : fileext = '.wmv'; break;
      case 'video/x-ms-asf' : fileext = '.asf'; break;
      case 'video/x-ms-wm' : fileext = '.wm'; break;
      case 'video/x-ms-wmx' : fileext = '.wmx'; break;
      case 'video/x-ms-wvx' : fileext = '.wvx'; break;
      case 'video/x-ms-vob' : fileext = '.vob'; break;
      case 'video/x-ms-asf' : fileext = '.asf'; break;
      case 'video/x-ms-asx' : fileext = '.asx'; break;
    }
    const baseMediaName = `${message.key.id}`;
    const fileName = `${baseMediaName}${fileext}`;
    await message.saveDocument(baseMediaPath + fileName);
    return fileName;
  }
  return null;
};

export const handleWebhookAudioMessage = async (message: MessageReceived) => {
  if (message.message?.audioMessage) {
    const baseMediaName = `${message.key.id}`;

    const fileName = `${baseMediaName}.mp3`;
    await message.saveAudio(baseMediaPath + fileName);
    return fileName;
  }
  return null;
};

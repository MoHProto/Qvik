import * as yup from "yup";

export const messageReplySchema = yup.object({
  replyText: yup.string(),
});

export type MessageReplyFormValues = yup.InferType<typeof messageReplySchema>;

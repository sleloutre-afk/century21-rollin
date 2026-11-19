import { z } from "zod";
import { texteSchema } from "./communs";

export const questionFaqSchema = z.strictObject({ q: texteSchema, a: texteSchema });

/** Une liste de questions par page (« vendre », puis « gerer », « quartiers »… aux lots suivants). */
export const fichierFaqSchema = z
  .object({ _source: z.string() })
  .catchall(z.array(questionFaqSchema).min(1));

export type QuestionFaq = z.infer<typeof questionFaqSchema>;

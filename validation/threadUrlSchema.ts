import * as yup from 'yup';

import { normalizeUrlInput } from 'utils/url/normalizeUrl';

export function createThreadUrlSchema(t: (key: string) => string) {
  return yup.object({
    url: yup
      .string()
      .trim()
      .required(t('threadUrl.validation.required'))
      .transform((v) => (typeof v === 'string' ? normalizeUrlInput(v) : v))
      .url(t('threadUrl.validation.invalid')),
  });
}

export type ThreadUrlFormValues = yup.InferType<ReturnType<typeof createThreadUrlSchema>>;

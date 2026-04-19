import * as yup from 'yup';

export function createAccountFormSchema(t: (key: string) => string) {
  return yup.object({
    /** New accounts use `''` until save; `defined()` fails if spread ever leaves `undefined`. */
    id: yup.string().ensure(),
    name: yup
      .string()
      .trim()
      .required(t('account.validation.nameRequired'))
      .max(120, t('account.validation.nameTooLong')),
    avatarUrl: yup.string().nullable().optional(),
    avatarIcon: yup.string().optional(),
    avatarBackground: yup.string().optional(),
    avatarColor: yup.string().optional(),
  });
}

export type AccountFormSchemaValues = yup.InferType<
  ReturnType<typeof createAccountFormSchema>
>;

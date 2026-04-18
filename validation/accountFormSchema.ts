import * as yup from 'yup';

export const accountFormSchema = yup.object({
  /** New accounts use `''` until save; `defined()` fails if spread ever leaves `undefined`. */
  id: yup.string().ensure(),
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .max(120, 'Name is too long'),
  avatarUrl: yup.string().nullable().optional(),
  avatarIcon: yup.string().optional(),
  avatarBackground: yup.string().optional(),
  avatarColor: yup.string().optional(),
});

export type AccountFormSchemaValues = yup.InferType<typeof accountFormSchema>;

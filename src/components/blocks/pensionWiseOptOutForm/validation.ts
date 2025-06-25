import * as yup from 'yup';

export const PensionWiseOptOutDeclarationSchema = yup.object({
    optOutPensionWise: yup
        .bool()
        .required()
        .oneOf([true])
        .default(false),
});

export type PensionWiseOptOutDeclarationFormType = yup.InferType<typeof PensionWiseOptOutDeclarationSchema>;

/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type VerificationCommentUpdateFormInputValues = {
    comment?: string;
    isCommentByVerifier?: boolean;
};
export declare type VerificationCommentUpdateFormValidationValues = {
    comment?: ValidationFunction<string>;
    isCommentByVerifier?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VerificationCommentUpdateFormOverridesProps = {
    VerificationCommentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    comment?: PrimitiveOverrideProps<TextFieldProps>;
    isCommentByVerifier?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type VerificationCommentUpdateFormProps = React.PropsWithChildren<{
    overrides?: VerificationCommentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    verificationComment?: any;
    onSubmit?: (fields: VerificationCommentUpdateFormInputValues) => VerificationCommentUpdateFormInputValues;
    onSuccess?: (fields: VerificationCommentUpdateFormInputValues) => void;
    onError?: (fields: VerificationCommentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VerificationCommentUpdateFormInputValues) => VerificationCommentUpdateFormInputValues;
    onValidate?: VerificationCommentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function VerificationCommentUpdateForm(props: VerificationCommentUpdateFormProps): React.ReactElement;

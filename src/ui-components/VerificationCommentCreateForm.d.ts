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
export declare type VerificationCommentCreateFormInputValues = {
    comment?: string;
    isCommentByVerifier?: boolean;
};
export declare type VerificationCommentCreateFormValidationValues = {
    comment?: ValidationFunction<string>;
    isCommentByVerifier?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VerificationCommentCreateFormOverridesProps = {
    VerificationCommentCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    comment?: PrimitiveOverrideProps<TextFieldProps>;
    isCommentByVerifier?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type VerificationCommentCreateFormProps = React.PropsWithChildren<{
    overrides?: VerificationCommentCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: VerificationCommentCreateFormInputValues) => VerificationCommentCreateFormInputValues;
    onSuccess?: (fields: VerificationCommentCreateFormInputValues) => void;
    onError?: (fields: VerificationCommentCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VerificationCommentCreateFormInputValues) => VerificationCommentCreateFormInputValues;
    onValidate?: VerificationCommentCreateFormValidationValues;
} & React.CSSProperties>;
export default function VerificationCommentCreateForm(props: VerificationCommentCreateFormProps): React.ReactElement;

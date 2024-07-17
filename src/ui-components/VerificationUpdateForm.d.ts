/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type VerificationUpdateFormInputValues = {
    createdOn?: string;
    updatedOn?: string;
    sign?: string;
};
export declare type VerificationUpdateFormValidationValues = {
    createdOn?: ValidationFunction<string>;
    updatedOn?: ValidationFunction<string>;
    sign?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type VerificationUpdateFormOverridesProps = {
    VerificationUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    createdOn?: PrimitiveOverrideProps<TextFieldProps>;
    updatedOn?: PrimitiveOverrideProps<TextFieldProps>;
    sign?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type VerificationUpdateFormProps = React.PropsWithChildren<{
    overrides?: VerificationUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    verification?: any;
    onSubmit?: (fields: VerificationUpdateFormInputValues) => VerificationUpdateFormInputValues;
    onSuccess?: (fields: VerificationUpdateFormInputValues) => void;
    onError?: (fields: VerificationUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: VerificationUpdateFormInputValues) => VerificationUpdateFormInputValues;
    onValidate?: VerificationUpdateFormValidationValues;
} & React.CSSProperties>;
export default function VerificationUpdateForm(props: VerificationUpdateFormProps): React.ReactElement;

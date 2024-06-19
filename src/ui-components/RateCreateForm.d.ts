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
export declare type RateCreateFormInputValues = {
    currency?: string;
    value?: number;
};
export declare type RateCreateFormValidationValues = {
    currency?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RateCreateFormOverridesProps = {
    RateCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RateCreateFormProps = React.PropsWithChildren<{
    overrides?: RateCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RateCreateFormInputValues) => RateCreateFormInputValues;
    onSuccess?: (fields: RateCreateFormInputValues) => void;
    onError?: (fields: RateCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RateCreateFormInputValues) => RateCreateFormInputValues;
    onValidate?: RateCreateFormValidationValues;
} & React.CSSProperties>;
export default function RateCreateForm(props: RateCreateFormProps): React.ReactElement;

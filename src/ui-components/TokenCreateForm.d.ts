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
export declare type TokenCreateFormInputValues = {
    policyID?: string;
    tokenName?: string;
    supply?: number;
    oraclePrice?: number;
};
export declare type TokenCreateFormValidationValues = {
    policyID?: ValidationFunction<string>;
    tokenName?: ValidationFunction<string>;
    supply?: ValidationFunction<number>;
    oraclePrice?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TokenCreateFormOverridesProps = {
    TokenCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    policyID?: PrimitiveOverrideProps<TextFieldProps>;
    tokenName?: PrimitiveOverrideProps<TextFieldProps>;
    supply?: PrimitiveOverrideProps<TextFieldProps>;
    oraclePrice?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TokenCreateFormProps = React.PropsWithChildren<{
    overrides?: TokenCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TokenCreateFormInputValues) => TokenCreateFormInputValues;
    onSuccess?: (fields: TokenCreateFormInputValues) => void;
    onError?: (fields: TokenCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TokenCreateFormInputValues) => TokenCreateFormInputValues;
    onValidate?: TokenCreateFormValidationValues;
} & React.CSSProperties>;
export default function TokenCreateForm(props: TokenCreateFormProps): React.ReactElement;

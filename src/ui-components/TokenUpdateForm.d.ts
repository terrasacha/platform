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
export declare type TokenUpdateFormInputValues = {
    policyID?: string;
    tokenName?: string;
    supply?: number;
    oraclePrice?: number;
};
export declare type TokenUpdateFormValidationValues = {
    policyID?: ValidationFunction<string>;
    tokenName?: ValidationFunction<string>;
    supply?: ValidationFunction<number>;
    oraclePrice?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TokenUpdateFormOverridesProps = {
    TokenUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    policyID?: PrimitiveOverrideProps<TextFieldProps>;
    tokenName?: PrimitiveOverrideProps<TextFieldProps>;
    supply?: PrimitiveOverrideProps<TextFieldProps>;
    oraclePrice?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TokenUpdateFormProps = React.PropsWithChildren<{
    overrides?: TokenUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    token?: any;
    onSubmit?: (fields: TokenUpdateFormInputValues) => TokenUpdateFormInputValues;
    onSuccess?: (fields: TokenUpdateFormInputValues) => void;
    onError?: (fields: TokenUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TokenUpdateFormInputValues) => TokenUpdateFormInputValues;
    onValidate?: TokenUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TokenUpdateForm(props: TokenUpdateFormProps): React.ReactElement;

/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type TransactionsCreateFormInputValues = {
    addressOrigin?: string;
    addressDestination?: string;
    txIn?: string;
    txOutput?: string;
    txCborhex?: string;
    txHash?: string;
    mint?: string;
    scriptDataHash?: string;
    metadataUrl?: string;
    redeemer?: string;
    fees?: number;
    network?: string;
    type?: string;
    signed?: boolean;
};
export declare type TransactionsCreateFormValidationValues = {
    addressOrigin?: ValidationFunction<string>;
    addressDestination?: ValidationFunction<string>;
    txIn?: ValidationFunction<string>;
    txOutput?: ValidationFunction<string>;
    txCborhex?: ValidationFunction<string>;
    txHash?: ValidationFunction<string>;
    mint?: ValidationFunction<string>;
    scriptDataHash?: ValidationFunction<string>;
    metadataUrl?: ValidationFunction<string>;
    redeemer?: ValidationFunction<string>;
    fees?: ValidationFunction<number>;
    network?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    signed?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TransactionsCreateFormOverridesProps = {
    TransactionsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    addressOrigin?: PrimitiveOverrideProps<TextFieldProps>;
    addressDestination?: PrimitiveOverrideProps<TextAreaFieldProps>;
    txIn?: PrimitiveOverrideProps<TextAreaFieldProps>;
    txOutput?: PrimitiveOverrideProps<TextAreaFieldProps>;
    txCborhex?: PrimitiveOverrideProps<TextFieldProps>;
    txHash?: PrimitiveOverrideProps<TextFieldProps>;
    mint?: PrimitiveOverrideProps<TextAreaFieldProps>;
    scriptDataHash?: PrimitiveOverrideProps<TextFieldProps>;
    metadataUrl?: PrimitiveOverrideProps<TextFieldProps>;
    redeemer?: PrimitiveOverrideProps<TextFieldProps>;
    fees?: PrimitiveOverrideProps<TextFieldProps>;
    network?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    signed?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type TransactionsCreateFormProps = React.PropsWithChildren<{
    overrides?: TransactionsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TransactionsCreateFormInputValues) => TransactionsCreateFormInputValues;
    onSuccess?: (fields: TransactionsCreateFormInputValues) => void;
    onError?: (fields: TransactionsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TransactionsCreateFormInputValues) => TransactionsCreateFormInputValues;
    onValidate?: TransactionsCreateFormValidationValues;
} & React.CSSProperties>;
export default function TransactionsCreateForm(props: TransactionsCreateFormProps): React.ReactElement;

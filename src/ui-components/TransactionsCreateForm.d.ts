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
    txCborhex?: string;
    txHash?: string;
    metadataUrl?: string;
    fees?: number;
    network?: string;
    txProcessed?: boolean;
    type?: string;
    tokenName?: string;
    amountOfTokens?: number;
    policyID?: string;
    stakeAddress?: string;
};
export declare type TransactionsCreateFormValidationValues = {
    addressOrigin?: ValidationFunction<string>;
    addressDestination?: ValidationFunction<string>;
    txIn?: ValidationFunction<string>;
    txCborhex?: ValidationFunction<string>;
    txHash?: ValidationFunction<string>;
    metadataUrl?: ValidationFunction<string>;
    fees?: ValidationFunction<number>;
    network?: ValidationFunction<string>;
    txProcessed?: ValidationFunction<boolean>;
    type?: ValidationFunction<string>;
    tokenName?: ValidationFunction<string>;
    amountOfTokens?: ValidationFunction<number>;
    policyID?: ValidationFunction<string>;
    stakeAddress?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TransactionsCreateFormOverridesProps = {
    TransactionsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    addressOrigin?: PrimitiveOverrideProps<TextFieldProps>;
    addressDestination?: PrimitiveOverrideProps<TextFieldProps>;
    txIn?: PrimitiveOverrideProps<TextFieldProps>;
    txCborhex?: PrimitiveOverrideProps<TextFieldProps>;
    txHash?: PrimitiveOverrideProps<TextFieldProps>;
    metadataUrl?: PrimitiveOverrideProps<TextAreaFieldProps>;
    fees?: PrimitiveOverrideProps<TextFieldProps>;
    network?: PrimitiveOverrideProps<TextFieldProps>;
    txProcessed?: PrimitiveOverrideProps<SwitchFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    tokenName?: PrimitiveOverrideProps<TextFieldProps>;
    amountOfTokens?: PrimitiveOverrideProps<TextFieldProps>;
    policyID?: PrimitiveOverrideProps<TextFieldProps>;
    stakeAddress?: PrimitiveOverrideProps<TextFieldProps>;
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

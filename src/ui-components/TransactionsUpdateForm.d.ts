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
export declare type TransactionsUpdateFormInputValues = {
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
export declare type TransactionsUpdateFormValidationValues = {
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
export declare type TransactionsUpdateFormOverridesProps = {
    TransactionsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
export declare type TransactionsUpdateFormProps = React.PropsWithChildren<{
    overrides?: TransactionsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    transactions?: any;
    onSubmit?: (fields: TransactionsUpdateFormInputValues) => TransactionsUpdateFormInputValues;
    onSuccess?: (fields: TransactionsUpdateFormInputValues) => void;
    onError?: (fields: TransactionsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TransactionsUpdateFormInputValues) => TransactionsUpdateFormInputValues;
    onValidate?: TransactionsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TransactionsUpdateForm(props: TransactionsUpdateFormProps): React.ReactElement;

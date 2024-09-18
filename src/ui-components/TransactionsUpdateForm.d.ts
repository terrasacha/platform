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
export declare type TransactionsUpdateFormValidationValues = {
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
export declare type TransactionsUpdateFormOverridesProps = {
    TransactionsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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

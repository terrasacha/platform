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
export declare type WalletCreateFormInputValues = {
    name?: string;
    status?: string;
    password?: string;
    seed?: string;
    address?: string;
    stake_address?: string;
    isSelected?: boolean;
    isAdmin?: boolean;
    claimed_token?: boolean;
};
export declare type WalletCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    password?: ValidationFunction<string>;
    seed?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    stake_address?: ValidationFunction<string>;
    isSelected?: ValidationFunction<boolean>;
    isAdmin?: ValidationFunction<boolean>;
    claimed_token?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type WalletCreateFormOverridesProps = {
    WalletCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
    seed?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    stake_address?: PrimitiveOverrideProps<TextFieldProps>;
    isSelected?: PrimitiveOverrideProps<SwitchFieldProps>;
    isAdmin?: PrimitiveOverrideProps<SwitchFieldProps>;
    claimed_token?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type WalletCreateFormProps = React.PropsWithChildren<{
    overrides?: WalletCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: WalletCreateFormInputValues) => WalletCreateFormInputValues;
    onSuccess?: (fields: WalletCreateFormInputValues) => void;
    onError?: (fields: WalletCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: WalletCreateFormInputValues) => WalletCreateFormInputValues;
    onValidate?: WalletCreateFormValidationValues;
} & React.CSSProperties>;
export default function WalletCreateForm(props: WalletCreateFormProps): React.ReactElement;

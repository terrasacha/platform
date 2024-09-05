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
export declare type WalletUpdateFormInputValues = {
    name?: string;
    status?: string;
    password?: string;
    seed?: string;
    address?: string;
    stake_address?: string;
    claimed_token?: boolean;
    isSelected?: boolean;
    isAdmin?: boolean;
};
export declare type WalletUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    password?: ValidationFunction<string>;
    seed?: ValidationFunction<string>;
    address?: ValidationFunction<string>;
    stake_address?: ValidationFunction<string>;
    claimed_token?: ValidationFunction<boolean>;
    isSelected?: ValidationFunction<boolean>;
    isAdmin?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type WalletUpdateFormOverridesProps = {
    WalletUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
    seed?: PrimitiveOverrideProps<TextFieldProps>;
    address?: PrimitiveOverrideProps<TextFieldProps>;
    stake_address?: PrimitiveOverrideProps<TextFieldProps>;
    claimed_token?: PrimitiveOverrideProps<SwitchFieldProps>;
    isSelected?: PrimitiveOverrideProps<SwitchFieldProps>;
    isAdmin?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type WalletUpdateFormProps = React.PropsWithChildren<{
    overrides?: WalletUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    wallet?: any;
    onSubmit?: (fields: WalletUpdateFormInputValues) => WalletUpdateFormInputValues;
    onSuccess?: (fields: WalletUpdateFormInputValues) => void;
    onError?: (fields: WalletUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: WalletUpdateFormInputValues) => WalletUpdateFormInputValues;
    onValidate?: WalletUpdateFormValidationValues;
} & React.CSSProperties>;
export default function WalletUpdateForm(props: WalletUpdateFormProps): React.ReactElement;

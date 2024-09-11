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
export declare type PaymentUpdateFormInputValues = {
    orderType?: string;
    ref?: string;
    walletAddress?: string;
    statusCode?: string;
    walletStakeAddress?: string;
    tokenName?: string;
    tokenAmount?: number;
    fee?: number;
    baseValue?: number;
    finalValue?: number;
    currency?: string;
    exchangeRate?: number;
    timestamp?: number;
    claimedByUser?: boolean;
};
export declare type PaymentUpdateFormValidationValues = {
    orderType?: ValidationFunction<string>;
    ref?: ValidationFunction<string>;
    walletAddress?: ValidationFunction<string>;
    statusCode?: ValidationFunction<string>;
    walletStakeAddress?: ValidationFunction<string>;
    tokenName?: ValidationFunction<string>;
    tokenAmount?: ValidationFunction<number>;
    fee?: ValidationFunction<number>;
    baseValue?: ValidationFunction<number>;
    finalValue?: ValidationFunction<number>;
    currency?: ValidationFunction<string>;
    exchangeRate?: ValidationFunction<number>;
    timestamp?: ValidationFunction<number>;
    claimedByUser?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentUpdateFormOverridesProps = {
    PaymentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    orderType?: PrimitiveOverrideProps<TextFieldProps>;
    ref?: PrimitiveOverrideProps<TextFieldProps>;
    walletAddress?: PrimitiveOverrideProps<TextFieldProps>;
    statusCode?: PrimitiveOverrideProps<TextFieldProps>;
    walletStakeAddress?: PrimitiveOverrideProps<TextFieldProps>;
    tokenName?: PrimitiveOverrideProps<TextFieldProps>;
    tokenAmount?: PrimitiveOverrideProps<TextFieldProps>;
    fee?: PrimitiveOverrideProps<TextFieldProps>;
    baseValue?: PrimitiveOverrideProps<TextFieldProps>;
    finalValue?: PrimitiveOverrideProps<TextFieldProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    exchangeRate?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    claimedByUser?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type PaymentUpdateFormProps = React.PropsWithChildren<{
    overrides?: PaymentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    payment?: any;
    onSubmit?: (fields: PaymentUpdateFormInputValues) => PaymentUpdateFormInputValues;
    onSuccess?: (fields: PaymentUpdateFormInputValues) => void;
    onError?: (fields: PaymentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PaymentUpdateFormInputValues) => PaymentUpdateFormInputValues;
    onValidate?: PaymentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PaymentUpdateForm(props: PaymentUpdateFormProps): React.ReactElement;

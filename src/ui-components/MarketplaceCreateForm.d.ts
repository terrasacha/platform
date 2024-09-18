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
export declare type MarketplaceCreateFormInputValues = {
    name?: string;
    oracleWallet?: string;
};
export declare type MarketplaceCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    oracleWallet?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MarketplaceCreateFormOverridesProps = {
    MarketplaceCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    oracleWallet?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MarketplaceCreateFormProps = React.PropsWithChildren<{
    overrides?: MarketplaceCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MarketplaceCreateFormInputValues) => MarketplaceCreateFormInputValues;
    onSuccess?: (fields: MarketplaceCreateFormInputValues) => void;
    onError?: (fields: MarketplaceCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MarketplaceCreateFormInputValues) => MarketplaceCreateFormInputValues;
    onValidate?: MarketplaceCreateFormValidationValues;
} & React.CSSProperties>;
export default function MarketplaceCreateForm(props: MarketplaceCreateFormProps): React.ReactElement;

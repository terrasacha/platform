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
export declare type MarketplaceUpdateFormInputValues = {
    name?: string;
    oracleWallet?: string;
};
export declare type MarketplaceUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    oracleWallet?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MarketplaceUpdateFormOverridesProps = {
    MarketplaceUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    oracleWallet?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MarketplaceUpdateFormProps = React.PropsWithChildren<{
    overrides?: MarketplaceUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    marketplace?: any;
    onSubmit?: (fields: MarketplaceUpdateFormInputValues) => MarketplaceUpdateFormInputValues;
    onSuccess?: (fields: MarketplaceUpdateFormInputValues) => void;
    onError?: (fields: MarketplaceUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MarketplaceUpdateFormInputValues) => MarketplaceUpdateFormInputValues;
    onValidate?: MarketplaceUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MarketplaceUpdateForm(props: MarketplaceUpdateFormProps): React.ReactElement;

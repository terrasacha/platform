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
export declare type ProductCreateFormInputValues = {
    name?: string;
    description?: string;
    isActive?: boolean;
    isActiveOnPlatform?: boolean;
    showOn?: string;
    order?: number;
    status?: string;
    timeOnVerification?: number;
    projectReadiness?: boolean;
    tokenClaimedByOwner?: boolean;
    tokenGenesis?: boolean;
};
export declare type ProductCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
    isActiveOnPlatform?: ValidationFunction<boolean>;
    showOn?: ValidationFunction<string>;
    order?: ValidationFunction<number>;
    status?: ValidationFunction<string>;
    timeOnVerification?: ValidationFunction<number>;
    projectReadiness?: ValidationFunction<boolean>;
    tokenClaimedByOwner?: ValidationFunction<boolean>;
    tokenGenesis?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductCreateFormOverridesProps = {
    ProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    isActiveOnPlatform?: PrimitiveOverrideProps<SwitchFieldProps>;
    showOn?: PrimitiveOverrideProps<TextFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    timeOnVerification?: PrimitiveOverrideProps<TextFieldProps>;
    projectReadiness?: PrimitiveOverrideProps<SwitchFieldProps>;
    tokenClaimedByOwner?: PrimitiveOverrideProps<SwitchFieldProps>;
    tokenGenesis?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProductCreateFormProps = React.PropsWithChildren<{
    overrides?: ProductCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProductCreateFormInputValues) => ProductCreateFormInputValues;
    onSuccess?: (fields: ProductCreateFormInputValues) => void;
    onError?: (fields: ProductCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductCreateFormInputValues) => ProductCreateFormInputValues;
    onValidate?: ProductCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProductCreateForm(props: ProductCreateFormProps): React.ReactElement;
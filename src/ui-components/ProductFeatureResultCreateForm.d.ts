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
export declare type ProductFeatureResultCreateFormInputValues = {
    isActive?: boolean;
    name?: string;
};
export declare type ProductFeatureResultCreateFormValidationValues = {
    isActive?: ValidationFunction<boolean>;
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductFeatureResultCreateFormOverridesProps = {
    ProductFeatureResultCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProductFeatureResultCreateFormProps = React.PropsWithChildren<{
    overrides?: ProductFeatureResultCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProductFeatureResultCreateFormInputValues) => ProductFeatureResultCreateFormInputValues;
    onSuccess?: (fields: ProductFeatureResultCreateFormInputValues) => void;
    onError?: (fields: ProductFeatureResultCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductFeatureResultCreateFormInputValues) => ProductFeatureResultCreateFormInputValues;
    onValidate?: ProductFeatureResultCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProductFeatureResultCreateForm(props: ProductFeatureResultCreateFormProps): React.ReactElement;

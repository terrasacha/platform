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
export declare type ProductItemCreateFormInputValues = {
    name?: string;
    type?: string;
};
export declare type ProductItemCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductItemCreateFormOverridesProps = {
    ProductItemCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProductItemCreateFormProps = React.PropsWithChildren<{
    overrides?: ProductItemCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProductItemCreateFormInputValues) => ProductItemCreateFormInputValues;
    onSuccess?: (fields: ProductItemCreateFormInputValues) => void;
    onError?: (fields: ProductItemCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductItemCreateFormInputValues) => ProductItemCreateFormInputValues;
    onValidate?: ProductItemCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProductItemCreateForm(props: ProductItemCreateFormProps): React.ReactElement;

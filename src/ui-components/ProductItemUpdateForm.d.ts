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
export declare type ProductItemUpdateFormInputValues = {
    name?: string;
    type?: string;
};
export declare type ProductItemUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductItemUpdateFormOverridesProps = {
    ProductItemUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProductItemUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProductItemUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    productItem?: any;
    onSubmit?: (fields: ProductItemUpdateFormInputValues) => ProductItemUpdateFormInputValues;
    onSuccess?: (fields: ProductItemUpdateFormInputValues) => void;
    onError?: (fields: ProductItemUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductItemUpdateFormInputValues) => ProductItemUpdateFormInputValues;
    onValidate?: ProductItemUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProductItemUpdateForm(props: ProductItemUpdateFormProps): React.ReactElement;

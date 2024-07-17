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
export declare type ProductFeatureUpdateFormInputValues = {
    value?: string;
    isToBlockChain?: boolean;
    order?: number;
    isOnMainCard?: boolean;
    isResult?: boolean;
};
export declare type ProductFeatureUpdateFormValidationValues = {
    value?: ValidationFunction<string>;
    isToBlockChain?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    isOnMainCard?: ValidationFunction<boolean>;
    isResult?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductFeatureUpdateFormOverridesProps = {
    ProductFeatureUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
    isToBlockChain?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    isOnMainCard?: PrimitiveOverrideProps<SwitchFieldProps>;
    isResult?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProductFeatureUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProductFeatureUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    productFeature?: any;
    onSubmit?: (fields: ProductFeatureUpdateFormInputValues) => ProductFeatureUpdateFormInputValues;
    onSuccess?: (fields: ProductFeatureUpdateFormInputValues) => void;
    onError?: (fields: ProductFeatureUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductFeatureUpdateFormInputValues) => ProductFeatureUpdateFormInputValues;
    onValidate?: ProductFeatureUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProductFeatureUpdateForm(props: ProductFeatureUpdateFormProps): React.ReactElement;

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
export declare type ProductFeatureCreateFormInputValues = {
    value?: string;
    isToBlockChain?: boolean;
    order?: number;
    isOnMainCard?: boolean;
    isResult?: boolean;
};
export declare type ProductFeatureCreateFormValidationValues = {
    value?: ValidationFunction<string>;
    isToBlockChain?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
    isOnMainCard?: ValidationFunction<boolean>;
    isResult?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductFeatureCreateFormOverridesProps = {
    ProductFeatureCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
    isToBlockChain?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    isOnMainCard?: PrimitiveOverrideProps<SwitchFieldProps>;
    isResult?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProductFeatureCreateFormProps = React.PropsWithChildren<{
    overrides?: ProductFeatureCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ProductFeatureCreateFormInputValues) => ProductFeatureCreateFormInputValues;
    onSuccess?: (fields: ProductFeatureCreateFormInputValues) => void;
    onError?: (fields: ProductFeatureCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductFeatureCreateFormInputValues) => ProductFeatureCreateFormInputValues;
    onValidate?: ProductFeatureCreateFormValidationValues;
} & React.CSSProperties>;
export default function ProductFeatureCreateForm(props: ProductFeatureCreateFormProps): React.ReactElement;

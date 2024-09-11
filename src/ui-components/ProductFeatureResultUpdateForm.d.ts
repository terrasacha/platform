/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps } from "@aws-amplify/ui-react";
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
export declare type ProductFeatureResultUpdateFormInputValues = {
    isActive?: boolean;
};
export declare type ProductFeatureResultUpdateFormValidationValues = {
    isActive?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProductFeatureResultUpdateFormOverridesProps = {
    ProductFeatureResultUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ProductFeatureResultUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProductFeatureResultUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    productFeatureResult?: any;
    onSubmit?: (fields: ProductFeatureResultUpdateFormInputValues) => ProductFeatureResultUpdateFormInputValues;
    onSuccess?: (fields: ProductFeatureResultUpdateFormInputValues) => void;
    onError?: (fields: ProductFeatureResultUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProductFeatureResultUpdateFormInputValues) => ProductFeatureResultUpdateFormInputValues;
    onValidate?: ProductFeatureResultUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProductFeatureResultUpdateForm(props: ProductFeatureResultUpdateFormProps): React.ReactElement;

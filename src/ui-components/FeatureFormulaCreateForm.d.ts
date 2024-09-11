/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
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
export declare type FeatureFormulaCreateFormInputValues = {};
export declare type FeatureFormulaCreateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FeatureFormulaCreateFormOverridesProps = {
    FeatureFormulaCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type FeatureFormulaCreateFormProps = React.PropsWithChildren<{
    overrides?: FeatureFormulaCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FeatureFormulaCreateFormInputValues) => FeatureFormulaCreateFormInputValues;
    onSuccess?: (fields: FeatureFormulaCreateFormInputValues) => void;
    onError?: (fields: FeatureFormulaCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FeatureFormulaCreateFormInputValues) => FeatureFormulaCreateFormInputValues;
    onValidate?: FeatureFormulaCreateFormValidationValues;
} & React.CSSProperties>;
export default function FeatureFormulaCreateForm(props: FeatureFormulaCreateFormProps): React.ReactElement;

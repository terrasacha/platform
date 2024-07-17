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
export declare type FeatureFormulaUpdateFormInputValues = {};
export declare type FeatureFormulaUpdateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FeatureFormulaUpdateFormOverridesProps = {
    FeatureFormulaUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type FeatureFormulaUpdateFormProps = React.PropsWithChildren<{
    overrides?: FeatureFormulaUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    featureFormula?: any;
    onSubmit?: (fields: FeatureFormulaUpdateFormInputValues) => FeatureFormulaUpdateFormInputValues;
    onSuccess?: (fields: FeatureFormulaUpdateFormInputValues) => void;
    onError?: (fields: FeatureFormulaUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FeatureFormulaUpdateFormInputValues) => FeatureFormulaUpdateFormInputValues;
    onValidate?: FeatureFormulaUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FeatureFormulaUpdateForm(props: FeatureFormulaUpdateFormProps): React.ReactElement;

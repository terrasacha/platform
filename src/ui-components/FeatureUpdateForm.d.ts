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
export declare type FeatureUpdateFormInputValues = {
    name?: string;
    description?: string;
    isTemplate?: boolean;
    isVerifable?: boolean;
    defaultValue?: string;
    formOrder?: number;
    formHint?: string;
    formRequired?: boolean;
    formAppearance?: string;
    formRelevant?: string;
    formConstraint?: string;
    formRequiredMessage?: string;
};
export declare type FeatureUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    isTemplate?: ValidationFunction<boolean>;
    isVerifable?: ValidationFunction<boolean>;
    defaultValue?: ValidationFunction<string>;
    formOrder?: ValidationFunction<number>;
    formHint?: ValidationFunction<string>;
    formRequired?: ValidationFunction<boolean>;
    formAppearance?: ValidationFunction<string>;
    formRelevant?: ValidationFunction<string>;
    formConstraint?: ValidationFunction<string>;
    formRequiredMessage?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FeatureUpdateFormOverridesProps = {
    FeatureUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    isTemplate?: PrimitiveOverrideProps<SwitchFieldProps>;
    isVerifable?: PrimitiveOverrideProps<SwitchFieldProps>;
    defaultValue?: PrimitiveOverrideProps<TextFieldProps>;
    formOrder?: PrimitiveOverrideProps<TextFieldProps>;
    formHint?: PrimitiveOverrideProps<TextFieldProps>;
    formRequired?: PrimitiveOverrideProps<SwitchFieldProps>;
    formAppearance?: PrimitiveOverrideProps<TextFieldProps>;
    formRelevant?: PrimitiveOverrideProps<TextFieldProps>;
    formConstraint?: PrimitiveOverrideProps<TextFieldProps>;
    formRequiredMessage?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FeatureUpdateFormProps = React.PropsWithChildren<{
    overrides?: FeatureUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    feature?: any;
    onSubmit?: (fields: FeatureUpdateFormInputValues) => FeatureUpdateFormInputValues;
    onSuccess?: (fields: FeatureUpdateFormInputValues) => void;
    onError?: (fields: FeatureUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FeatureUpdateFormInputValues) => FeatureUpdateFormInputValues;
    onValidate?: FeatureUpdateFormValidationValues;
} & React.CSSProperties>;
export default function FeatureUpdateForm(props: FeatureUpdateFormProps): React.ReactElement;

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
export declare type FeatureCreateFormInputValues = {
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
export declare type FeatureCreateFormValidationValues = {
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
export declare type FeatureCreateFormOverridesProps = {
    FeatureCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
export declare type FeatureCreateFormProps = React.PropsWithChildren<{
    overrides?: FeatureCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FeatureCreateFormInputValues) => FeatureCreateFormInputValues;
    onSuccess?: (fields: FeatureCreateFormInputValues) => void;
    onError?: (fields: FeatureCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FeatureCreateFormInputValues) => FeatureCreateFormInputValues;
    onValidate?: FeatureCreateFormValidationValues;
} & React.CSSProperties>;
export default function FeatureCreateForm(props: FeatureCreateFormProps): React.ReactElement;

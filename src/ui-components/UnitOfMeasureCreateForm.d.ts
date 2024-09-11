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
export declare type UnitOfMeasureCreateFormInputValues = {
    engineeringUnit?: string;
    description?: string;
    isFloat?: boolean;
};
export declare type UnitOfMeasureCreateFormValidationValues = {
    engineeringUnit?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    isFloat?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UnitOfMeasureCreateFormOverridesProps = {
    UnitOfMeasureCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    engineeringUnit?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    isFloat?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type UnitOfMeasureCreateFormProps = React.PropsWithChildren<{
    overrides?: UnitOfMeasureCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UnitOfMeasureCreateFormInputValues) => UnitOfMeasureCreateFormInputValues;
    onSuccess?: (fields: UnitOfMeasureCreateFormInputValues) => void;
    onError?: (fields: UnitOfMeasureCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UnitOfMeasureCreateFormInputValues) => UnitOfMeasureCreateFormInputValues;
    onValidate?: UnitOfMeasureCreateFormValidationValues;
} & React.CSSProperties>;
export default function UnitOfMeasureCreateForm(props: UnitOfMeasureCreateFormProps): React.ReactElement;

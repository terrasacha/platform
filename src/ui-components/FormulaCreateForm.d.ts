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
export declare type FormulaCreateFormInputValues = {
    varID?: string;
    equation?: string;
};
export declare type FormulaCreateFormValidationValues = {
    varID?: ValidationFunction<string>;
    equation?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FormulaCreateFormOverridesProps = {
    FormulaCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    varID?: PrimitiveOverrideProps<TextFieldProps>;
    equation?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FormulaCreateFormProps = React.PropsWithChildren<{
    overrides?: FormulaCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FormulaCreateFormInputValues) => FormulaCreateFormInputValues;
    onSuccess?: (fields: FormulaCreateFormInputValues) => void;
    onError?: (fields: FormulaCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FormulaCreateFormInputValues) => FormulaCreateFormInputValues;
    onValidate?: FormulaCreateFormValidationValues;
} & React.CSSProperties>;
export default function FormulaCreateForm(props: FormulaCreateFormProps): React.ReactElement;

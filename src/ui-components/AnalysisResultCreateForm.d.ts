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
export declare type AnalysisResultCreateFormInputValues = {
    fuente?: string;
    modelo?: string;
    cobertura?: string;
    valor?: number;
    unidad?: string;
    proyecto?: string;
    nombreImagen?: string;
    data?: string;
};
export declare type AnalysisResultCreateFormValidationValues = {
    fuente?: ValidationFunction<string>;
    modelo?: ValidationFunction<string>;
    cobertura?: ValidationFunction<string>;
    valor?: ValidationFunction<number>;
    unidad?: ValidationFunction<string>;
    proyecto?: ValidationFunction<string>;
    nombreImagen?: ValidationFunction<string>;
    data?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AnalysisResultCreateFormOverridesProps = {
    AnalysisResultCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    fuente?: PrimitiveOverrideProps<TextFieldProps>;
    modelo?: PrimitiveOverrideProps<TextFieldProps>;
    cobertura?: PrimitiveOverrideProps<TextFieldProps>;
    valor?: PrimitiveOverrideProps<TextFieldProps>;
    unidad?: PrimitiveOverrideProps<TextFieldProps>;
    proyecto?: PrimitiveOverrideProps<TextFieldProps>;
    nombreImagen?: PrimitiveOverrideProps<TextFieldProps>;
    data?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AnalysisResultCreateFormProps = React.PropsWithChildren<{
    overrides?: AnalysisResultCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AnalysisResultCreateFormInputValues) => AnalysisResultCreateFormInputValues;
    onSuccess?: (fields: AnalysisResultCreateFormInputValues) => void;
    onError?: (fields: AnalysisResultCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AnalysisResultCreateFormInputValues) => AnalysisResultCreateFormInputValues;
    onValidate?: AnalysisResultCreateFormValidationValues;
} & React.CSSProperties>;
export default function AnalysisResultCreateForm(props: AnalysisResultCreateFormProps): React.ReactElement;

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
export declare type AnalysisResultUpdateFormInputValues = {
    fuente?: string;
    modelo?: string;
    cobertura?: string;
    valor?: number;
    unidad?: string;
    proyecto?: string;
    nombreImagen?: string;
    data?: string;
};
export declare type AnalysisResultUpdateFormValidationValues = {
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
export declare type AnalysisResultUpdateFormOverridesProps = {
    AnalysisResultUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    fuente?: PrimitiveOverrideProps<TextFieldProps>;
    modelo?: PrimitiveOverrideProps<TextFieldProps>;
    cobertura?: PrimitiveOverrideProps<TextFieldProps>;
    valor?: PrimitiveOverrideProps<TextFieldProps>;
    unidad?: PrimitiveOverrideProps<TextFieldProps>;
    proyecto?: PrimitiveOverrideProps<TextFieldProps>;
    nombreImagen?: PrimitiveOverrideProps<TextFieldProps>;
    data?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AnalysisResultUpdateFormProps = React.PropsWithChildren<{
    overrides?: AnalysisResultUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    analysisResult?: any;
    onSubmit?: (fields: AnalysisResultUpdateFormInputValues) => AnalysisResultUpdateFormInputValues;
    onSuccess?: (fields: AnalysisResultUpdateFormInputValues) => void;
    onError?: (fields: AnalysisResultUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AnalysisResultUpdateFormInputValues) => AnalysisResultUpdateFormInputValues;
    onValidate?: AnalysisResultUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AnalysisResultUpdateForm(props: AnalysisResultUpdateFormProps): React.ReactElement;

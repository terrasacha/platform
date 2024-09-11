/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type AnalisisCreateFormInputValues = {
    imgAnteriorNombreImg?: string;
    imgAnteriorSatellite?: string;
    imgAnteriorYear?: number;
    imgAnteriorMesInicial?: number;
    imgAnteriorMesFinal?: number;
    imgAnteriorNubosidadMaxima?: number;
    imgAnteriorBandas?: string;
    imgPosteriorNombreImg?: string;
    imgPosteriorSatellite?: string;
    imgPosteriorYear?: number;
    imgPosteriorMesInicial?: number;
    imgPosteriorMesFinal?: number;
    imgPosteriorNubosidadMaxima?: number;
    imgPosteriorBandas?: string;
    resultados?: string;
    ajustado?: boolean;
};
export declare type AnalisisCreateFormValidationValues = {
    imgAnteriorNombreImg?: ValidationFunction<string>;
    imgAnteriorSatellite?: ValidationFunction<string>;
    imgAnteriorYear?: ValidationFunction<number>;
    imgAnteriorMesInicial?: ValidationFunction<number>;
    imgAnteriorMesFinal?: ValidationFunction<number>;
    imgAnteriorNubosidadMaxima?: ValidationFunction<number>;
    imgAnteriorBandas?: ValidationFunction<string>;
    imgPosteriorNombreImg?: ValidationFunction<string>;
    imgPosteriorSatellite?: ValidationFunction<string>;
    imgPosteriorYear?: ValidationFunction<number>;
    imgPosteriorMesInicial?: ValidationFunction<number>;
    imgPosteriorMesFinal?: ValidationFunction<number>;
    imgPosteriorNubosidadMaxima?: ValidationFunction<number>;
    imgPosteriorBandas?: ValidationFunction<string>;
    resultados?: ValidationFunction<string>;
    ajustado?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AnalisisCreateFormOverridesProps = {
    AnalisisCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    imgAnteriorNombreImg?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorSatellite?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorYear?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorMesInicial?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorMesFinal?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorNubosidadMaxima?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorBandas?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorNombreImg?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorSatellite?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorYear?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorMesInicial?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorMesFinal?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorNubosidadMaxima?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorBandas?: PrimitiveOverrideProps<TextFieldProps>;
    resultados?: PrimitiveOverrideProps<TextAreaFieldProps>;
    ajustado?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type AnalisisCreateFormProps = React.PropsWithChildren<{
    overrides?: AnalisisCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AnalisisCreateFormInputValues) => AnalisisCreateFormInputValues;
    onSuccess?: (fields: AnalisisCreateFormInputValues) => void;
    onError?: (fields: AnalisisCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AnalisisCreateFormInputValues) => AnalisisCreateFormInputValues;
    onValidate?: AnalisisCreateFormValidationValues;
} & React.CSSProperties>;
export default function AnalisisCreateForm(props: AnalisisCreateFormProps): React.ReactElement;

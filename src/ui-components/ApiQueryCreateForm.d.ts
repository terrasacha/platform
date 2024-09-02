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
export declare type ApiQueryCreateFormInputValues = {
    cedulaCatastral?: string;
    imgAnteriorSatellite?: string;
    imgAnteriorYear?: number;
    imgAnteriorMesInicial?: number;
    imgAnteriorMesFinal?: number;
    imgAnteriorNubosidadMaxima?: number;
    imgPosteriorSatellite?: string;
    imgPosteriorYear?: number;
    imgPosteriorMesInicial?: number;
    imgPosteriorMesFinal?: number;
    imgPosteriorNubosidadMaxima?: number;
    fechaHoraConsulta?: number;
    fechaHoraActualizacion?: number;
    verificado?: boolean;
    rawConsulta?: string;
    resultadoConsulta?: string;
};
export declare type ApiQueryCreateFormValidationValues = {
    cedulaCatastral?: ValidationFunction<string>;
    imgAnteriorSatellite?: ValidationFunction<string>;
    imgAnteriorYear?: ValidationFunction<number>;
    imgAnteriorMesInicial?: ValidationFunction<number>;
    imgAnteriorMesFinal?: ValidationFunction<number>;
    imgAnteriorNubosidadMaxima?: ValidationFunction<number>;
    imgPosteriorSatellite?: ValidationFunction<string>;
    imgPosteriorYear?: ValidationFunction<number>;
    imgPosteriorMesInicial?: ValidationFunction<number>;
    imgPosteriorMesFinal?: ValidationFunction<number>;
    imgPosteriorNubosidadMaxima?: ValidationFunction<number>;
    fechaHoraConsulta?: ValidationFunction<number>;
    fechaHoraActualizacion?: ValidationFunction<number>;
    verificado?: ValidationFunction<boolean>;
    rawConsulta?: ValidationFunction<string>;
    resultadoConsulta?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApiQueryCreateFormOverridesProps = {
    ApiQueryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    cedulaCatastral?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorSatellite?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorYear?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorMesInicial?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorMesFinal?: PrimitiveOverrideProps<TextFieldProps>;
    imgAnteriorNubosidadMaxima?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorSatellite?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorYear?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorMesInicial?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorMesFinal?: PrimitiveOverrideProps<TextFieldProps>;
    imgPosteriorNubosidadMaxima?: PrimitiveOverrideProps<TextFieldProps>;
    fechaHoraConsulta?: PrimitiveOverrideProps<TextFieldProps>;
    fechaHoraActualizacion?: PrimitiveOverrideProps<TextFieldProps>;
    verificado?: PrimitiveOverrideProps<SwitchFieldProps>;
    rawConsulta?: PrimitiveOverrideProps<TextAreaFieldProps>;
    resultadoConsulta?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ApiQueryCreateFormProps = React.PropsWithChildren<{
    overrides?: ApiQueryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ApiQueryCreateFormInputValues) => ApiQueryCreateFormInputValues;
    onSuccess?: (fields: ApiQueryCreateFormInputValues) => void;
    onError?: (fields: ApiQueryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ApiQueryCreateFormInputValues) => ApiQueryCreateFormInputValues;
    onValidate?: ApiQueryCreateFormValidationValues;
} & React.CSSProperties>;
export default function ApiQueryCreateForm(props: ApiQueryCreateFormProps): React.ReactElement;

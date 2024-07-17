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
export declare type ResultCreateFormInputValues = {
    varID?: string;
    value?: number;
    dateTimeStamp?: number;
};
export declare type ResultCreateFormValidationValues = {
    varID?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
    dateTimeStamp?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ResultCreateFormOverridesProps = {
    ResultCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    varID?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
    dateTimeStamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ResultCreateFormProps = React.PropsWithChildren<{
    overrides?: ResultCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ResultCreateFormInputValues) => ResultCreateFormInputValues;
    onSuccess?: (fields: ResultCreateFormInputValues) => void;
    onError?: (fields: ResultCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ResultCreateFormInputValues) => ResultCreateFormInputValues;
    onValidate?: ResultCreateFormValidationValues;
} & React.CSSProperties>;
export default function ResultCreateForm(props: ResultCreateFormProps): React.ReactElement;

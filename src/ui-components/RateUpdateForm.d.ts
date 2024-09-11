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
export declare type RateUpdateFormInputValues = {
    currency?: string;
    value?: number;
};
export declare type RateUpdateFormValidationValues = {
    currency?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RateUpdateFormOverridesProps = {
    RateUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    currency?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RateUpdateFormProps = React.PropsWithChildren<{
    overrides?: RateUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    rate?: any;
    onSubmit?: (fields: RateUpdateFormInputValues) => RateUpdateFormInputValues;
    onSuccess?: (fields: RateUpdateFormInputValues) => void;
    onError?: (fields: RateUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RateUpdateFormInputValues) => RateUpdateFormInputValues;
    onValidate?: RateUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RateUpdateForm(props: RateUpdateFormProps): React.ReactElement;

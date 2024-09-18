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
export declare type OrderUpdateFormInputValues = {
    statusCode?: string;
    tokenPolicyId?: string;
    tokenName?: string;
    tokenAmount?: number;
    utxos?: string;
    value?: number;
};
export declare type OrderUpdateFormValidationValues = {
    statusCode?: ValidationFunction<string>;
    tokenPolicyId?: ValidationFunction<string>;
    tokenName?: ValidationFunction<string>;
    tokenAmount?: ValidationFunction<number>;
    utxos?: ValidationFunction<string>;
    value?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type OrderUpdateFormOverridesProps = {
    OrderUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    statusCode?: PrimitiveOverrideProps<TextFieldProps>;
    tokenPolicyId?: PrimitiveOverrideProps<TextFieldProps>;
    tokenName?: PrimitiveOverrideProps<TextFieldProps>;
    tokenAmount?: PrimitiveOverrideProps<TextFieldProps>;
    utxos?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type OrderUpdateFormProps = React.PropsWithChildren<{
    overrides?: OrderUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    order?: any;
    onSubmit?: (fields: OrderUpdateFormInputValues) => OrderUpdateFormInputValues;
    onSuccess?: (fields: OrderUpdateFormInputValues) => void;
    onError?: (fields: OrderUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: OrderUpdateFormInputValues) => OrderUpdateFormInputValues;
    onValidate?: OrderUpdateFormValidationValues;
} & React.CSSProperties>;
export default function OrderUpdateForm(props: OrderUpdateFormProps): React.ReactElement;

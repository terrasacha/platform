/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
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
export declare type ClaimedTokenCreateFormInputValues = {};
export declare type ClaimedTokenCreateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ClaimedTokenCreateFormOverridesProps = {
    ClaimedTokenCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ClaimedTokenCreateFormProps = React.PropsWithChildren<{
    overrides?: ClaimedTokenCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ClaimedTokenCreateFormInputValues) => ClaimedTokenCreateFormInputValues;
    onSuccess?: (fields: ClaimedTokenCreateFormInputValues) => void;
    onError?: (fields: ClaimedTokenCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ClaimedTokenCreateFormInputValues) => ClaimedTokenCreateFormInputValues;
    onValidate?: ClaimedTokenCreateFormValidationValues;
} & React.CSSProperties>;
export default function ClaimedTokenCreateForm(props: ClaimedTokenCreateFormProps): React.ReactElement;

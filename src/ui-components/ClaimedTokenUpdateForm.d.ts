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
export declare type ClaimedTokenUpdateFormInputValues = {};
export declare type ClaimedTokenUpdateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ClaimedTokenUpdateFormOverridesProps = {
    ClaimedTokenUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ClaimedTokenUpdateFormProps = React.PropsWithChildren<{
    overrides?: ClaimedTokenUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    claimedToken?: any;
    onSubmit?: (fields: ClaimedTokenUpdateFormInputValues) => ClaimedTokenUpdateFormInputValues;
    onSuccess?: (fields: ClaimedTokenUpdateFormInputValues) => void;
    onError?: (fields: ClaimedTokenUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ClaimedTokenUpdateFormInputValues) => ClaimedTokenUpdateFormInputValues;
    onValidate?: ClaimedTokenUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ClaimedTokenUpdateForm(props: ClaimedTokenUpdateFormProps): React.ReactElement;

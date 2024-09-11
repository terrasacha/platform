/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps } from "@aws-amplify/ui-react";
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
export declare type UserProductCreateFormInputValues = {
    isFavorite?: boolean;
};
export declare type UserProductCreateFormValidationValues = {
    isFavorite?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserProductCreateFormOverridesProps = {
    UserProductCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    isFavorite?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type UserProductCreateFormProps = React.PropsWithChildren<{
    overrides?: UserProductCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserProductCreateFormInputValues) => UserProductCreateFormInputValues;
    onSuccess?: (fields: UserProductCreateFormInputValues) => void;
    onError?: (fields: UserProductCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserProductCreateFormInputValues) => UserProductCreateFormInputValues;
    onValidate?: UserProductCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserProductCreateForm(props: UserProductCreateFormProps): React.ReactElement;

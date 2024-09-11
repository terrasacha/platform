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
export declare type UserProductUpdateFormInputValues = {
    isFavorite?: boolean;
};
export declare type UserProductUpdateFormValidationValues = {
    isFavorite?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserProductUpdateFormOverridesProps = {
    UserProductUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    isFavorite?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type UserProductUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserProductUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userProduct?: any;
    onSubmit?: (fields: UserProductUpdateFormInputValues) => UserProductUpdateFormInputValues;
    onSuccess?: (fields: UserProductUpdateFormInputValues) => void;
    onError?: (fields: UserProductUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserProductUpdateFormInputValues) => UserProductUpdateFormInputValues;
    onValidate?: UserProductUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserProductUpdateForm(props: UserProductUpdateFormProps): React.ReactElement;

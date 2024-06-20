/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type UserUpdateFormInputValues = {
    name?: string;
    dateOfBirth?: string;
    isProfileUpdated?: boolean;
    isValidatedStep1?: boolean;
    isValidatedStep2?: boolean;
    addresss?: string;
    cellphone?: string;
    role?: string;
    subrole?: string;
    status?: string;
    email?: string;
};
export declare type UserUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    dateOfBirth?: ValidationFunction<string>;
    isProfileUpdated?: ValidationFunction<boolean>;
    isValidatedStep1?: ValidationFunction<boolean>;
    isValidatedStep2?: ValidationFunction<boolean>;
    addresss?: ValidationFunction<string>;
    cellphone?: ValidationFunction<string>;
    role?: ValidationFunction<string>;
    subrole?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserUpdateFormOverridesProps = {
    UserUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    dateOfBirth?: PrimitiveOverrideProps<TextFieldProps>;
    isProfileUpdated?: PrimitiveOverrideProps<SwitchFieldProps>;
    isValidatedStep1?: PrimitiveOverrideProps<SwitchFieldProps>;
    isValidatedStep2?: PrimitiveOverrideProps<SwitchFieldProps>;
    addresss?: PrimitiveOverrideProps<TextFieldProps>;
    cellphone?: PrimitiveOverrideProps<TextFieldProps>;
    role?: PrimitiveOverrideProps<TextFieldProps>;
    subrole?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    user?: any;
    onSubmit?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onSuccess?: (fields: UserUpdateFormInputValues) => void;
    onError?: (fields: UserUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onValidate?: UserUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserUpdateForm(props: UserUpdateFormProps): React.ReactElement;

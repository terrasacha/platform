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
export declare type ScriptUpdateFormInputValues = {
    name?: string;
    script_type?: string;
    script_category?: string;
    pbk?: string[];
    token_name?: string;
    cbor?: string;
    testnetAddr?: string;
    MainnetAddr?: string;
    Active?: boolean;
    base_code?: string;
};
export declare type ScriptUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    script_type?: ValidationFunction<string>;
    script_category?: ValidationFunction<string>;
    pbk?: ValidationFunction<string>;
    token_name?: ValidationFunction<string>;
    cbor?: ValidationFunction<string>;
    testnetAddr?: ValidationFunction<string>;
    MainnetAddr?: ValidationFunction<string>;
    Active?: ValidationFunction<boolean>;
    base_code?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ScriptUpdateFormOverridesProps = {
    ScriptUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    script_type?: PrimitiveOverrideProps<TextFieldProps>;
    script_category?: PrimitiveOverrideProps<TextFieldProps>;
    pbk?: PrimitiveOverrideProps<TextFieldProps>;
    token_name?: PrimitiveOverrideProps<TextFieldProps>;
    cbor?: PrimitiveOverrideProps<TextFieldProps>;
    testnetAddr?: PrimitiveOverrideProps<TextFieldProps>;
    MainnetAddr?: PrimitiveOverrideProps<TextFieldProps>;
    Active?: PrimitiveOverrideProps<SwitchFieldProps>;
    base_code?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ScriptUpdateFormProps = React.PropsWithChildren<{
    overrides?: ScriptUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    script?: any;
    onSubmit?: (fields: ScriptUpdateFormInputValues) => ScriptUpdateFormInputValues;
    onSuccess?: (fields: ScriptUpdateFormInputValues) => void;
    onError?: (fields: ScriptUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ScriptUpdateFormInputValues) => ScriptUpdateFormInputValues;
    onValidate?: ScriptUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ScriptUpdateForm(props: ScriptUpdateFormProps): React.ReactElement;

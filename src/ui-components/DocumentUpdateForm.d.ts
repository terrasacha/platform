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
export declare type DocumentUpdateFormInputValues = {
    data?: string;
    timeStamp?: number;
    docHash?: string;
    url?: string;
    signed?: string;
    signedHash?: string;
    isApproved?: boolean;
    status?: string;
    isUploadedToBlockChain?: boolean;
};
export declare type DocumentUpdateFormValidationValues = {
    data?: ValidationFunction<string>;
    timeStamp?: ValidationFunction<number>;
    docHash?: ValidationFunction<string>;
    url?: ValidationFunction<string>;
    signed?: ValidationFunction<string>;
    signedHash?: ValidationFunction<string>;
    isApproved?: ValidationFunction<boolean>;
    status?: ValidationFunction<string>;
    isUploadedToBlockChain?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DocumentUpdateFormOverridesProps = {
    DocumentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    data?: PrimitiveOverrideProps<TextAreaFieldProps>;
    timeStamp?: PrimitiveOverrideProps<TextFieldProps>;
    docHash?: PrimitiveOverrideProps<TextFieldProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    signed?: PrimitiveOverrideProps<TextFieldProps>;
    signedHash?: PrimitiveOverrideProps<TextFieldProps>;
    isApproved?: PrimitiveOverrideProps<SwitchFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    isUploadedToBlockChain?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type DocumentUpdateFormProps = React.PropsWithChildren<{
    overrides?: DocumentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    document?: any;
    onSubmit?: (fields: DocumentUpdateFormInputValues) => DocumentUpdateFormInputValues;
    onSuccess?: (fields: DocumentUpdateFormInputValues) => void;
    onError?: (fields: DocumentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DocumentUpdateFormInputValues) => DocumentUpdateFormInputValues;
    onValidate?: DocumentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DocumentUpdateForm(props: DocumentUpdateFormProps): React.ReactElement;

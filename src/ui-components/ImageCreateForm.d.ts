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
export declare type ImageCreateFormInputValues = {
    imageURL?: string;
    format?: string;
    title?: string;
    imageURLToDisplay?: string;
    isOnCarousel?: boolean;
    carouselLabel?: string;
    carouselDescription?: string;
    isActive?: boolean;
    order?: number;
};
export declare type ImageCreateFormValidationValues = {
    imageURL?: ValidationFunction<string>;
    format?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    imageURLToDisplay?: ValidationFunction<string>;
    isOnCarousel?: ValidationFunction<boolean>;
    carouselLabel?: ValidationFunction<string>;
    carouselDescription?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
    order?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImageCreateFormOverridesProps = {
    ImageCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    imageURL?: PrimitiveOverrideProps<TextFieldProps>;
    format?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    imageURLToDisplay?: PrimitiveOverrideProps<TextFieldProps>;
    isOnCarousel?: PrimitiveOverrideProps<SwitchFieldProps>;
    carouselLabel?: PrimitiveOverrideProps<TextFieldProps>;
    carouselDescription?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ImageCreateFormProps = React.PropsWithChildren<{
    overrides?: ImageCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ImageCreateFormInputValues) => ImageCreateFormInputValues;
    onSuccess?: (fields: ImageCreateFormInputValues) => void;
    onError?: (fields: ImageCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImageCreateFormInputValues) => ImageCreateFormInputValues;
    onValidate?: ImageCreateFormValidationValues;
} & React.CSSProperties>;
export default function ImageCreateForm(props: ImageCreateFormProps): React.ReactElement;

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
export declare type ImageUpdateFormInputValues = {
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
export declare type ImageUpdateFormValidationValues = {
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
export declare type ImageUpdateFormOverridesProps = {
    ImageUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
export declare type ImageUpdateFormProps = React.PropsWithChildren<{
    overrides?: ImageUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    image?: any;
    onSubmit?: (fields: ImageUpdateFormInputValues) => ImageUpdateFormInputValues;
    onSuccess?: (fields: ImageUpdateFormInputValues) => void;
    onError?: (fields: ImageUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImageUpdateFormInputValues) => ImageUpdateFormInputValues;
    onValidate?: ImageUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ImageUpdateForm(props: ImageUpdateFormProps): React.ReactElement;

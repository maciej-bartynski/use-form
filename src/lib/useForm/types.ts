import { FormValuesAbstract } from "lib/types";

export type FormMessages<FormValues extends FormValuesAbstract> = {
    [Property in keyof FormValues]: string | undefined;
};

export type FormTouched<FormValues extends FormValuesAbstract> = {
    [Property in keyof FormValues]: boolean;
};

export type FormChecking<FormValues extends FormValuesAbstract> = {
    [Property in keyof FormValues]: boolean;
};

export type Checkers<FormValues extends FormValuesAbstract> = Partial<{
    [Property in keyof FormValues]: (arg: FormValues[Property], form: FormState<FormValues>) => string | undefined;
}>;

export type AsyncCheckers<FormValues extends FormValuesAbstract> = Partial<{
    [Property in keyof FormValues]: (
        arg: FormValues[Property],
        form: FormState<FormValues>,
    ) => Promise<string | undefined>;
}>;

export interface UseFormParams<FormValues extends FormValuesAbstract> {
    initialValues: FormValues;
    initialIsTouched?: boolean;
    initialIsError?: boolean,
    initialIsWarning?: boolean,
    initialIsChecking?: boolean,
    initialErrors?: FormMessages<FormValues>,
    initialWarnings?: FormMessages<FormValues>,
    initialAsyncErrors?: FormMessages<FormValues>,
    initialAsyncWarnings?: FormMessages<FormValues>,
    initialIsSubmitting?: boolean,
    initialChecking?: FormChecking<FormValues>,
    initialTouched?: FormTouched<FormValues>,
    onSubmit?: OnSubmit<FormValues>;
    onSubmitFail?: OnSubmitFail<FormValues>;
    validators?: Checkers<FormValues>;
    warningators?: Checkers<FormValues>;
    asyncValidators?: AsyncCheckers<FormValues>;
    asyncWarningators?: AsyncCheckers<FormValues>;
}

export interface FormState<FormValues extends FormValuesAbstract> {
    values: FormValues;
    errors: FormMessages<FormValues>;
    warnings: FormMessages<FormValues>;
    asyncErrors: FormMessages<FormValues>;
    asyncWarnings: FormMessages<FormValues>;
    touched: FormTouched<FormValues>;
    checking: FormChecking<FormValues>;

    dirty: boolean;

    isSubmitting: boolean;
    isError: boolean;
    isWarning: boolean;
    isChecking: boolean;
    isTouched: boolean;
}

export interface FormContextType<FormValues extends FormValuesAbstract> extends FormState<FormValues> {
    submitForm: () => void;
    asyncOnFieldChange: AsyncMethodWithFormValuesAsParams<FormValues>;
    onFieldChange: MethodWithFormValuesAsParams<FormValues>;
    setValues: MethodWithFormValuesAsParams<FormValues>;
    setMessages: MethodWithFormValuesAsParams<FormValues>;
    asyncSetMessages: AsyncMethodWithFormValuesAsParams<FormValues>;
    setTouched: MethodWithFormValuesAsParams<FormValues>;
}

export interface SetMessagesMethod<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): void;
}

export interface AsyncSetMessagesMethod<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): Promise<void>;
}

export interface SetValuesMethod<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): void;
}

export interface SetFieldValue<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): Promise<void>;
}

export interface MethodWithFormValuesAsParams<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): void;
}
export interface AsyncMethodWithFormValuesAsParams<FormValues extends FormValuesAbstract> {
    (params: Partial<FormValues>): Promise<void>;
}

export interface OnSubmit<FormValues extends FormValuesAbstract> {
    (params: FormState<FormValues>): Promise<void>;
}

export interface OnSubmitFail<FormValues extends FormValuesAbstract> {
    (params: FormState<FormValues>): void;
}

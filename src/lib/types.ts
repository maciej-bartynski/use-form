export type FormStateErrorsAndWarningsType<T> = {
    [Property in keyof T]: string | undefined;
};

export type FormStateTouchedType<T> = {
    [Property in keyof T]: boolean;
};

export type CheckerMethods<FormValues> = Partial<{
    [Property in keyof FormValues]: (arg: FormValues[Property], form: FormStateType<FormValues>) => string | undefined;
}>;

export type AsyncCheckerMethods<FormValues> = Partial<{
    [Property in keyof FormValues]: (
        arg: FormValues[Property],
        form: FormStateType<FormValues>,
    ) => Promise<string | undefined>;
}>;

export interface UseFormParams<InitialValuesType> {
    initialDirty?: boolean;
    initialValues: InitialValuesType;
    onSubmit?: OnSubmit<InitialValuesType>;
    onSubmitFail?: OnSubmitFail<InitialValuesType>;
    validators?: CheckerMethods<InitialValuesType>;
    warningators?: CheckerMethods<InitialValuesType>;
    asyncValidators?: AsyncCheckerMethods<InitialValuesType>;
    asyncWarningators?: AsyncCheckerMethods<InitialValuesType>;
}

export interface FormStateType<InitialValuesType = Record<string, never>> {
    values: InitialValuesType;
    errors: FormStateErrorsAndWarningsType<InitialValuesType>;
    warnings: FormStateErrorsAndWarningsType<InitialValuesType>;
    asyncErrors: FormStateErrorsAndWarningsType<InitialValuesType>;
    asyncWarnings: FormStateErrorsAndWarningsType<InitialValuesType>;
    touched: FormStateTouchedType<InitialValuesType>;
    dirty: boolean;
    isSubmitting: boolean;
    isChecking: boolean;
}

export interface FormContextType<FormValuesType> extends FormStateType<FormValuesType> {
    submitForm: () => void;
    asyncOnFieldChange: AsyncMethodWithFormValuesAsParams<FormValuesType>;
    onFieldChange: MethodWithFormValuesAsParams<FormValuesType>;
    setValues: MethodWithFormValuesAsParams<FormValuesType>;
    setMessages: MethodWithFormValuesAsParams<FormValuesType>;
    asyncSetMessages: AsyncMethodWithFormValuesAsParams<FormValuesType>;
    setTouched: MethodWithFormValuesAsParams<FormValuesType>;
}

export interface SetMessagesMethod<FormValuesType> {
    (params: Partial<FormValuesType>): void;
}

export interface AsyncSetMessagesMethod<FormValuesType> {
    (params: Partial<FormValuesType>): Promise<void>;
}

export interface SetValuesMethod<FormValuesType> {
    (params: Partial<FormValuesType>): void;
}

export interface SetFieldValue<FormValuesType> {
    (params: Partial<FormValuesType>): Promise<void>;
}

export interface MethodWithFormValuesAsParams<FormValuesType> {
    (params: Partial<FormValuesType>): void;
}
export interface AsyncMethodWithFormValuesAsParams<FormValuesType> {
    (params: Partial<FormValuesType>): Promise<void>;
}

export interface OnSubmit<FormValuesType> {
    (params: FormStateType<FormValuesType>): Promise<void>;
}

export interface OnSubmitFail<FormValuesType> {
    (params: FormStateType<FormValuesType>): void;
}

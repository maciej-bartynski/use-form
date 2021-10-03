import { FormContextType, FormStateErrorsAndWarningsType, FormStateTouchedType, FormStateType } from "./types";

export function getInitialState<FormValuesType>(initialValues?: FormValuesType, initialDirty?: boolean): FormStateType<FormValuesType> {
    return {
        values: initialValues as FormValuesType,
        errors: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        warnings: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        asyncErrors: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        asyncWarnings: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        touched: {} as FormStateTouchedType<FormValuesType>,
        dirty: !!initialDirty,
        isSubmitting: false,
        isChecking: false,
    }
}

export function getInitialContextValue<FormValuesType>(initialValues: FormValuesType): FormContextType<FormValuesType> {
    return {
        values: initialValues || {} as FormValuesType,
        errors: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        warnings: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        asyncErrors: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        asyncWarnings: {} as FormStateErrorsAndWarningsType<FormValuesType>,
        touched: {} as FormStateTouchedType<FormValuesType>,
        dirty: false,
        isSubmitting: false,
        isChecking: false,
        submitForm: () => { },
        setFields: async () => { }
    };
}





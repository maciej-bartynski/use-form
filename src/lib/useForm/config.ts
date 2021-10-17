import { FormValuesAbstract } from 'lib/types';
import { FormContextType, FormMessages, FormTouched, FormState, FormChecking } from './types';

type GetInitialStateParams = {
    
}
export function getInitialState<FormValues extends FormValuesAbstract>(
    {
        initialValues,
        initialTouched,
        initialIsTouched,
        initialIsError,
        initialIsWarning,
        initialIsChecking,
        initialErrors,
        initialWarnings,
        initialAsyncErrors,
        initialAsyncWarnings,
        initialIsSubmitting,
        initialChecking
    } : {
        initialValues: FormValues,
        initialTouched?: FormTouched<FormValues>,
        initialChecking?: FormChecking<FormValues>,
        initialIsTouched?: boolean,
        initialIsError?: boolean,
        initialIsWarning?: boolean,
        initialIsChecking?: boolean,
        initialErrors?: FormMessages<FormValues>,
        initialWarnings?: FormMessages<FormValues>,
        initialAsyncErrors?: FormMessages<FormValues>,
        initialAsyncWarnings?: FormMessages<FormValues>,
        initialIsSubmitting?: boolean,
    }
): FormState<FormValues> {
    return {
        values: initialValues as FormValues,
        errors: initialErrors || {} as FormMessages<FormValues>,
        warnings: initialWarnings || {} as FormMessages<FormValues>,
        asyncErrors: initialAsyncErrors || {} as FormMessages<FormValues>,
        asyncWarnings: initialAsyncWarnings || {} as FormMessages<FormValues>,
        touched: initialTouched || {} as FormTouched<FormValues>,
        checking: initialChecking || {} as FormChecking<FormValues>,
        dirty: !!initialIsTouched,
        isSubmitting: !!initialIsSubmitting,
        isChecking: !!initialIsChecking,
        isError: !!initialIsError,
        isWarning: !!initialIsWarning,
        isTouched: !!initialIsTouched,
    };
}

export function getInitialContextValue<FormValues extends FormValuesAbstract>(initialValues: FormValues): FormContextType<FormValues> {
    return {
        values: initialValues || ({} as FormValues),
        errors: {} as FormMessages<FormValues>,
        warnings: {} as FormMessages<FormValues>,
        asyncErrors: {} as FormMessages<FormValues>,
        asyncWarnings: {} as FormMessages<FormValues>,
        touched: {} as FormTouched<FormValues>,
        checking: {} as FormChecking<FormValues>,
        dirty: false,
        isSubmitting: false,
        isChecking: false,
        isError: false,
        isWarning: false,
        isTouched: false,
        submitForm: function () {
            return;
        },
        asyncOnFieldChange: async function () {
            return;
        },
        onFieldChange: function () {
            return;
        },
        setValues: function () {
            return;
        },
        setMessages: function () {
            return;
        },
        asyncSetMessages: async function () {
            return;
        },
        setTouched: function () {
            return;
        },
    };
}

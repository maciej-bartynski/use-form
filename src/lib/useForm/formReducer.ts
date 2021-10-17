import { FormValuesAbstract } from 'lib/types';
import { FormChecking, FormMessages, FormTouched, FormState } from './types';
import { getChecking } from './utils';

export enum FormActionType {
    SetMessages = 'SetMessages',
    SetTouched = 'SetTouched',
    AsyncSetMessages = 'AsyncSetMessages',
    SetValues = 'SetValues',
    OnFieldsChange = 'OnFieldsChange',
    AsyncOnFieldsChange = 'AsyncOnFieldsChange',
    SetChecking = 'SetChecking',

    SetSubmitting = 'SetSubmitting',
    EndSubmitting = 'EndSubmitting',
}

interface FormActionSetMessages<FormValues extends FormValuesAbstract> {
    type: FormActionType.SetMessages;
    payload: {
        errors: FormMessages<FormValues>;
        warnings: FormMessages<FormValues>;
    };
}

interface FormActionAsyncSetMessages<FormValues extends FormValuesAbstract> {
    type: FormActionType.AsyncSetMessages;
    payload: {
        asyncErrors: FormMessages<FormValues>;
        asyncWarnings: FormMessages<FormValues>;
        checking: FormChecking<FormValues>
    };
}

interface FormActionSetTouched<FormValues extends FormValuesAbstract> {
    type: FormActionType.SetTouched;
    payload: FormTouched<FormValues>;
}

interface FormActionSetValues<FormValues extends FormValuesAbstract> {
    type: FormActionType.SetValues;
    payload: Partial<FormValues>;
}

interface FormActionOnFieldsChange<FormValues extends FormValuesAbstract> {
    type: FormActionType.OnFieldsChange;
    payload: {
        errors: FormMessages<FormValues>;
        warnings: FormMessages<FormValues>;
        touched: FormTouched<FormValues>;
        values: Partial<FormValues>;
    };
}

interface FormActionAsyncOnFieldsChange<FormValues extends FormValuesAbstract> {
    type: FormActionType.AsyncOnFieldsChange;
    payload: {
        errors: FormMessages<FormValues>;
        warnings: FormMessages<FormValues>;
        asyncErrors: FormMessages<FormValues>;
        asyncWarnings: FormMessages<FormValues>;
        touched: FormTouched<FormValues>;
        values: Partial<FormValues>;
        checking: FormChecking<FormValues>;
    };
}

interface FormActionSetChecking<FormValues extends FormValuesAbstract> {
    type: FormActionType.SetChecking;
    payload: FormChecking<FormValues>
}

interface FormActionSetSubmitting {
    type: FormActionType.SetSubmitting;
}

interface FormActionEndSubmitting<FormValues extends FormValuesAbstract> {
    type: FormActionType.EndSubmitting;
    payload: FormState<FormValues>;
}

export function getFormReducer<FormValues extends FormValuesAbstract>(): (
    state: FormState<FormValues>,
    action: FormAction<FormValues>,
) => FormState<FormValues> {
    return formReducer;
}

type FormAction<FormValues extends FormValuesAbstract> =
    | FormActionSetValues<FormValues>
    | FormActionSetTouched<FormValues>
    | FormActionSetMessages<FormValues>
    | FormActionAsyncSetMessages<FormValues>
    | FormActionOnFieldsChange<FormValues>
    | FormActionAsyncOnFieldsChange<FormValues>
    | FormActionSetChecking<FormValues>
    | FormActionEndSubmitting<FormValues>
    | FormActionSetSubmitting;

function formReducer<FormValues extends FormValuesAbstract>(
    state: FormState<FormValues>,
    action: FormAction<FormValues>,
): FormState<FormValues> {
    switch (action.type) {
        case FormActionType.SetTouched: {
            return {
                ...state,
                dirty: true,
                isTouched: true,
                touched: {
                    ...state.touched,
                    ...action.payload,
                },
            };
        }
        case FormActionType.SetValues: {
            return {
                ...state,
                dirty: true,
                isTouched: true,
                values: {
                    ...state.values,
                    ...action.payload,
                },
            };
        }
        case FormActionType.SetMessages: {
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                warnings: {
                    ...state.warnings,
                    ...action.payload.warnings,
                },
            };
        }
        case FormActionType.AsyncSetMessages: {
            return {
                ...state,
                isChecking: false,
                
                asyncErrors: {
                    ...state.asyncErrors,
                    ...action.payload.asyncErrors,
                },
                asyncWarnings: {
                    ...state.asyncWarnings,
                    ...action.payload.asyncWarnings,
                },
                checking: {
                    ...state.checking,
                    ...action.payload.checking
                }
            };
        }
        case FormActionType.SetChecking: {
            return {
                ...state,
                isChecking: true,
                dirty: true,
                isTouched: true,
                checking: {
                    ...state.checking,
                    ...action.payload
                }
            };
        }
        case FormActionType.OnFieldsChange: {
            const errors = {
                ...state.errors,
                ...action.payload.errors,
            };
            const warnings = {
                ...state.warnings,
                ...action.payload.warnings,
            };
            const isError = Object.values({ ...errors, ...state.asyncErrors}).some(value => !!value );
            const isWarning = Object.values({ ...warnings, ...state.asyncWarnings}).some(value => !!value );
            return {
                ...state,
                dirty: true,
                isError,
                isWarning,
                isTouched: true,
                warnings,
                errors,
                touched: {
                    ...state.touched,
                    ...action.payload.touched,
                },
                values: {
                    ...state.values,
                    ...action.payload.values,
                },
            };
        }
        case FormActionType.AsyncOnFieldsChange: {
            const checking = {
                ...state.checking,
                ...action.payload.checking
            };
            const errors = {
                ...state.errors,
                ...action.payload.errors,
            };
            const asyncErrors = {
                ...state.asyncErrors,
                ...action.payload.asyncErrors,
            };
            const warnings = {
                ...state.warnings,
                ...action.payload.warnings,
            };
            const asyncWarnings = {
                ...state.asyncWarnings,
                ...action.payload.asyncWarnings,
            };
            const isChecking = Object.values(checking).some(value => value);
            const isError = Object.values({ ...errors, ...asyncErrors}).some(value => !!value );
            const isWarning = Object.values({ ...warnings, ...asyncWarnings}).some(value => !!value );

            return {
                ...state,
                isChecking,
                isTouched: true,
                isError,
                isWarning,
                asyncWarnings,
                asyncErrors,
                warnings,
                errors,
                touched: {
                    ...state.touched,
                    ...action.payload.touched,
                },
                values: {
                    ...state.values,
                    ...action.payload.values,
                },
                checking
            };
        }
        case FormActionType.SetSubmitting: {
            return {
                ...state,
                isSubmitting: true,
            };
        }
        case FormActionType.EndSubmitting: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}

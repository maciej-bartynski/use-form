import { FormStateErrorsAndWarningsType, FormStateTouchedType, FormStateType } from './types';

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

interface FormActionSetMessages<FormValues> {
    type: FormActionType.SetMessages;
    payload: {
        errors: FormStateErrorsAndWarningsType<FormValues>;
        warnings: FormStateErrorsAndWarningsType<FormValues>;
    };
}

interface FormActionAsyncSetMessages<FormValues> {
    type: FormActionType.AsyncSetMessages;
    payload: {
        asyncErrors: FormStateErrorsAndWarningsType<FormValues>;
        asyncWarnings: FormStateErrorsAndWarningsType<FormValues>;
    };
}

interface FormActionSetTouched<FormValues> {
    type: FormActionType.SetTouched;
    payload: FormStateTouchedType<FormValues>;
}

interface FormActionSetValues<FormValues> {
    type: FormActionType.SetValues;
    payload: Partial<FormValues>;
}

interface FormActionOnFieldsChange<FormValues> {
    type: FormActionType.OnFieldsChange;
    payload: {
        errors: FormStateErrorsAndWarningsType<FormValues>;
        warnings: FormStateErrorsAndWarningsType<FormValues>;
        touched: FormStateTouchedType<FormValues>;
        values: Partial<FormValues>;
    };
}

interface FormActionAsyncOnFieldsChange<FormValues> {
    type: FormActionType.AsyncOnFieldsChange;
    payload: {
        errors: FormStateErrorsAndWarningsType<FormValues>;
        warnings: FormStateErrorsAndWarningsType<FormValues>;
        asyncErrors: FormStateErrorsAndWarningsType<FormValues>;
        asyncWarnings: FormStateErrorsAndWarningsType<FormValues>;
        touched: FormStateTouchedType<FormValues>;
        values: Partial<FormValues>;
    };
}

interface FormActionSetChecking {
    type: FormActionType.SetChecking;
}

interface FormActionSetSubmitting {
    type: FormActionType.SetSubmitting;
}

interface FormActionEndSubmitting<FormValues> {
    type: FormActionType.EndSubmitting;
    payload: FormStateType<FormValues>;
}

export function getFormReducer<FormValuesType>(): (
    state: FormStateType<FormValuesType>,
    action: FormAction<FormValuesType>,
) => FormStateType<FormValuesType> {
    return formReducer;
}

type FormAction<FormValues> =
    | FormActionSetValues<FormValues>
    | FormActionSetTouched<FormValues>
    | FormActionSetMessages<FormValues>
    | FormActionAsyncSetMessages<FormValues>
    | FormActionOnFieldsChange<FormValues>
    | FormActionAsyncOnFieldsChange<FormValues>
    | FormActionSetChecking
    | FormActionEndSubmitting<FormValues>
    | FormActionSetSubmitting;

function formReducer<FormValuesType>(
    state: FormStateType<FormValuesType>,
    action: FormAction<FormValuesType>,
): FormStateType<FormValuesType> {
    switch (action.type) {
        case FormActionType.SetTouched: {
            return {
                ...state,
                dirty: true,
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
            };
        }
        case FormActionType.SetChecking: {
            return {
                ...state,
                isChecking: true,
                dirty: true,
            };
        }
        case FormActionType.OnFieldsChange: {
            return {
                ...state,
                dirty: true,
                warnings: {
                    ...state.warnings,
                    ...action.payload.warnings,
                },
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
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
            return {
                ...state,
                isChecking: false,
                asyncWarnings: {
                    ...state.asyncWarnings,
                    ...action.payload.asyncWarnings,
                },
                asyncErrors: {
                    ...state.asyncErrors,
                    ...action.payload.asyncErrors,
                },
                warnings: {
                    ...state.warnings,
                    ...action.payload.warnings,
                },
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
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

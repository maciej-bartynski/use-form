import { FormStateErrorsAndWarningsType, FormStateTouchedType, FormStateType } from './types';

enum _FormActionType {
    SetMessages = 'SetMessages',
    SetTouched = 'SetTouched',
    AsyncSetMessages = 'AsyncSetMessages',
    SetValues = 'SetValues',
}

interface FormActionSetMessages<FormValues> {
    type: _FormActionType.SetMessages;
    payload: {
        errors: FormStateErrorsAndWarningsType<FormValues>;
        warnings: FormStateErrorsAndWarningsType<FormValues>;
    };
}

interface FormActionAsyncSetMessages<FormValues> {
    type: _FormActionType.AsyncSetMessages;
    payload: {
        errors: FormStateErrorsAndWarningsType<FormValues>;
        warnings: FormStateErrorsAndWarningsType<FormValues>;
    };
}

interface FormActionSetTouched<FormValues> {
    type: _FormActionType.SetTouched;
    payload: FormStateTouchedType<FormValues>;
}

interface FormActionSetValues<FormValues> {
    type: _FormActionType.SetValues;
    payload: Partial<FormValues>;
}

// eslint-disable-next-line
type _FormAction<FormValues> =
    | FormActionSetValues<FormValues>
    | FormActionSetTouched<FormValues>
    | FormActionSetMessages<FormValues>
    | FormActionAsyncSetMessages<FormValues>;

export enum FormActionName {
    SetFields = 'SetFields',
    SetChecking = 'SetChecking',
    SetMessages = 'SetMessages',
    SetSubmitting = 'SetSubmitting',
    EndSubmitting = 'EndSubmitting',
}

type FormAction<FormValues> =
    | {
          type: FormActionName.SetFields;
          payload: {
              values: Partial<FormValues>;
              errors: FormStateErrorsAndWarningsType<FormValues>;
              warnings: FormStateErrorsAndWarningsType<FormValues>;
              touched: FormStateTouchedType<FormValues>;
          };
      }
    | {
          type: FormActionName.SetChecking;
      }
    | {
          type: FormActionName.SetMessages;
          payload: {
              errors: FormStateErrorsAndWarningsType<FormValues>;
              warnings: FormStateErrorsAndWarningsType<FormValues>;
          };
      }
    | {
          type: FormActionName.SetSubmitting;
          payload: boolean;
      }
    | {
          type: FormActionName.EndSubmitting;
          payload: FormStateType<FormValues>;
      };

export function getFormReducer<FormValuesType>(): (
    state: FormStateType<FormValuesType>,
    action: FormAction<FormValuesType>,
) => FormStateType<FormValuesType> {
    return formReducer;
}

function formReducer<FormValuesType>(
    state: FormStateType<FormValuesType>,
    action: FormAction<FormValuesType>,
): FormStateType<FormValuesType> {
    switch (action.type) {
        case FormActionName.SetFields: {
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
        case FormActionName.SetChecking: {
            return {
                ...state,
                isChecking: true,
            };
        }
        case FormActionName.SetMessages: {
            return {
                ...state,
                isChecking: false,
                asyncWarnings: {
                    ...state.warnings,
                    ...action.payload.warnings,
                },
                asyncErrors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
            };
        }
        case FormActionName.SetSubmitting: {
            return {
                ...state,
                isSubmitting: action.payload,
            };
        }
        case FormActionName.EndSubmitting: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}

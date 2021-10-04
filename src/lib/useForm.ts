import { useCallback, useReducer, useRef } from 'react';
import { getInitialState } from './config';
import { FormActionName, getFormReducer } from './formReducer';
import { FormContextType, SetFieldValue, UseFormParams } from './types';
import { asyncGetMessages, getMessages, getTouched } from './utils';

function useForm<FormValuesType>({
    initialDirty = false,
    initialValues,
    onSubmit,
    onSubmitFail,
    validators,
    warningators,
    asyncValidators,
    asyncWarningators,
}: UseFormParams<FormValuesType>): FormContextType<FormValuesType> {
    const initialStore = useRef(getInitialState<FormValuesType>(initialValues, initialDirty)).current;
    const reducer = useRef(getFormReducer<FormValuesType>()).current;
    const [store, dispatch] = useReducer(reducer, initialStore);

    const setAsyncMessages = useCallback(
        async (params: Partial<FormValuesType>) => {
            dispatch({ type: FormActionName.SetChecking });
            const asyncErrors = await asyncGetMessages(params, store, asyncValidators);
            const asyncWarnings = await asyncGetMessages(params, store, asyncWarningators);
            dispatch({
                type: FormActionName.SetMessages,
                payload: {
                    warnings: asyncWarnings,
                    errors: asyncErrors,
                },
            });
        },
        [dispatch, store, asyncValidators, asyncWarningators],
    );

    const setFields: SetFieldValue<FormValuesType> = useCallback(
        async (params) => {
            dispatch({
                type: FormActionName.SetFields,
                payload: {
                    warnings: getMessages<FormValuesType>(params, store, warningators),
                    errors: getMessages<FormValuesType>(params, store, validators),
                    values: params,
                    touched: getTouched(params),
                },
            });

            if (asyncWarningators || asyncValidators) {
                setAsyncMessages(params);
            }
        },
        [store, dispatch, setAsyncMessages, asyncWarningators, asyncValidators],
    );

    // eslint-disable-next-line
    const setTouched = () => {};
    // eslint-disable-next-line
    const setMessages = () => {};
    // eslint-disable-next-line
    const setAsyncMsgs = () => {};
    // eslint-disable-next-line
    const setValues = () => {};

    // eslint-disable-next-line
    const onFieldFocus = () => {
        // touched
    };

    // eslint-disable-next-line
    const onFieldBlur = () => {
        // validate
    };

    // eslint-disable-next-line
    const onFieldChange = () => {
        // touched
        // validate
        // set
    };

    const submitForm = useCallback(async () => {
        dispatch({
            type: FormActionName.SetSubmitting,
            payload: true,
        });

        let errors = {};
        let warnings = {};
        let asyncErrors = {};
        let asyncWarnings = {};

        if (validators || warningators) {
            errors = getMessages(store.values, store, validators);
            warnings = getMessages(store.values, store, warningators);
        }

        if (asyncValidators || asyncWarningators) {
            asyncErrors = await asyncGetMessages(store.values, store, asyncValidators);
            asyncWarnings = await asyncGetMessages(store.values, store, asyncWarningators);
        }

        const nextStore = {
            ...store,
            isSubmitting: false,
            warnings: { ...store.warnings, ...warnings },
            errors: { ...store.errors, ...errors },
            asyncWarnings: { ...store.asyncWarnings, ...asyncWarnings },
            asyncErrors: { ...store.asyncErrors, ...asyncErrors },
        };

        const hasErrors =
            Object.values(nextStore.errors).filter((item) => !!item).length ||
            Object.values(nextStore.asyncErrors).filter((item) => !!item).length;

        if (hasErrors && onSubmitFail) onSubmitFail(nextStore);
        else onSubmit && (await onSubmit(nextStore));
        dispatch({
            type: FormActionName.EndSubmitting,
            payload: nextStore,
        });
    }, [store, onSubmitFail, onSubmit]);

    return {
        ...store,
        setFields,
        submitForm,
    };
}

export default useForm;

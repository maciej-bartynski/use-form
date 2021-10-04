import { useCallback, useReducer, useRef } from 'react';
import { getInitialState } from './config';
import { getFormReducer, FormActionType } from './formReducer';
import {
    AsyncMethodWithFormValuesAsParams,
    FormContextType,
    MethodWithFormValuesAsParams,
    UseFormParams,
} from './types';
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

    const setTouched: MethodWithFormValuesAsParams<FormValuesType> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetTouched,
                payload: getTouched(params),
            });
        },
        [dispatch],
    );

    const asyncSetMessages: AsyncMethodWithFormValuesAsParams<FormValuesType> = useCallback(
        async (params) => {
            dispatch({ type: FormActionType.SetChecking });
            dispatch({
                type: FormActionType.AsyncSetMessages,
                payload: {
                    asyncWarnings: await asyncGetMessages<FormValuesType>(params, store, asyncWarningators),
                    asyncErrors: await asyncGetMessages<FormValuesType>(params, store, asyncValidators),
                },
            });
        },
        [dispatch, asyncWarningators, asyncValidators],
    );

    const setMessages: MethodWithFormValuesAsParams<FormValuesType> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetMessages,
                payload: {
                    warnings: getMessages<FormValuesType>(params, store, warningators),
                    errors: getMessages<FormValuesType>(params, store, validators),
                },
            });
        },
        [dispatch, warningators, validators],
    );

    const setValues: MethodWithFormValuesAsParams<FormValuesType> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetValues,
                payload: params,
            });
        },
        [dispatch],
    );

    const onFieldChange: MethodWithFormValuesAsParams<FormValuesType> = useCallback(
        (params) => {
            const warnings = getMessages(params, store, warningators);
            const errors = getMessages(params, store, validators);
            const touched = getTouched(params);
            dispatch({
                type: FormActionType.OnFieldsChange,
                payload: {
                    warnings,
                    errors,
                    touched,
                    values: params,
                },
            });
        },
        [dispatch, store, warningators, validators],
    );

    const asyncOnFieldChange: AsyncMethodWithFormValuesAsParams<FormValuesType> = useCallback(
        async (params) => {
            dispatch({
                type: FormActionType.SetChecking,
            });
            const asyncWarnings = await asyncGetMessages(params, store, asyncWarningators);
            const asyncErrors = await asyncGetMessages(params, store, asyncValidators);
            const touched = getTouched(params);
            const warnings = getMessages(params, store, warningators);
            const errors = getMessages(params, store, validators);
            dispatch({
                type: FormActionType.AsyncOnFieldsChange,
                payload: {
                    errors,
                    warnings,
                    asyncWarnings,
                    asyncErrors,
                    touched,
                    values: params,
                },
            });
        },
        [dispatch, store, warningators, validators, asyncValidators, asyncWarningators],
    );

    const submitForm = useCallback(async () => {
        dispatch({
            type: FormActionType.SetSubmitting,
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
            type: FormActionType.EndSubmitting,
            payload: nextStore,
        });
    }, [store, onSubmitFail, onSubmit]);

    return {
        ...store,
        submitForm,
        asyncOnFieldChange,
        onFieldChange,
        setValues,
        setMessages,
        asyncSetMessages,
        setTouched,
    };
}

export default useForm;

import { FormValuesAbstract } from 'lib/types';
import { useCallback, useReducer, useRef } from 'react';
import { getInitialState } from './config';
import { getFormReducer, FormActionType } from './formReducer';
import {
    AsyncMethodWithFormValuesAsParams,
    FormChecking,
    FormContextType,
    MethodWithFormValuesAsParams,
    UseFormParams,
} from './types';
import { asyncGetMessages, getChecking, getFalsifiedChecking, getMessages, getTouched } from './utils';

function useForm<FormValues extends FormValuesAbstract>({
    initialIsError = false,
    initialIsWarning = false,
    initialIsChecking = false,
    initialIsTouched = false,
    initialErrors,
    initialWarnings,
    initialAsyncErrors,
    initialAsyncWarnings,
    initialIsSubmitting,
    initialValues,
    initialChecking,
    initialTouched,
    onSubmit,
    onSubmitFail,
    validators,
    warningators,
    asyncValidators,
    asyncWarningators,
}: UseFormParams<FormValues>): FormContextType<FormValues> {
    const initialStore = useRef(getInitialState<FormValues>({
        initialValues,
        initialIsTouched,
        initialIsError,
        initialIsWarning,
        initialIsChecking,
        initialErrors,
        initialWarnings,
        initialAsyncErrors,
        initialAsyncWarnings,
        initialChecking,
        initialTouched,
        initialIsSubmitting,
    })).current;
    const reducer = useRef(getFormReducer<FormValues>()).current;
    const [store, dispatch] = useReducer(reducer, initialStore);

    const setTouched: MethodWithFormValuesAsParams<FormValues> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetTouched,
                payload: getTouched(params),
            });
        },
        [dispatch],
    );

    const asyncSetMessages: AsyncMethodWithFormValuesAsParams<FormValues> = useCallback(
        async (params) => {
            const fieldsWitchChecker = getChecking(
                params, 
                warningators,
                validators,
                asyncWarningators,
                asyncValidators
            )
            dispatch({
                type: FormActionType.SetChecking,
                payload: fieldsWitchChecker
            });
            dispatch({
                type: FormActionType.AsyncSetMessages,
                payload: {
                    asyncWarnings: await asyncGetMessages<FormValues>(params, store, asyncWarningators),
                    asyncErrors: await asyncGetMessages<FormValues>(params, store, asyncValidators),
                    checking: getFalsifiedChecking(fieldsWitchChecker)
                },
            });
        },
        [dispatch, store, asyncWarningators, asyncValidators],
    );

    const setMessages: MethodWithFormValuesAsParams<FormValues> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetMessages,
                payload: {
                    warnings: getMessages<FormValues>(params, store, warningators),
                    errors: getMessages<FormValues>(params, store, validators),
                },
            });
        },
        [dispatch, warningators, validators],
    );

    const setValues: MethodWithFormValuesAsParams<FormValues> = useCallback(
        (params) => {
            dispatch({
                type: FormActionType.SetValues,
                payload: params,
            });
        },
        [dispatch],
    );

    const onFieldChange: MethodWithFormValuesAsParams<FormValues> = useCallback(
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

    const asyncOnFieldChange: AsyncMethodWithFormValuesAsParams<FormValues> = useCallback(
        async (params) => {
            const checking = getChecking(
                params, 
                warningators,
                validators,
                asyncWarningators,
                asyncValidators
            )
            dispatch({
                type: FormActionType.SetChecking,
                payload: checking
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
                    checking: getFalsifiedChecking(checking)
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

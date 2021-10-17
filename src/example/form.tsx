import React from 'react';
import useForm from 'lib/useForm';
import { initialValues } from './config';
import './index.css';
import { asyncValidators } from './asyncCheckers';
import { validators, warningators } from './checkers';
import TextInput from './TextInput';
import Checkbox from './Checkbox';

const Form: React.FC = () => {
    const form = useForm({
        initialDirty: true,
        initialValues,
        asyncValidators: asyncValidators,
        validators: validators,
        warningators: warningators,
        onSubmitFail: async (data) => {
            // eslint-disable-next-line
            console.log('=====');
            // eslint-disable-next-line
            console.log('Validation failure.');
            // eslint-disable-next-line
            console.log('Failure handler data: ', data);
            // eslint-disable-next-line
            console.log('=====');
        },
        onSubmit: async (data) => {
            // eslint-disable-next-line
            console.log('=====');
            // eslint-disable-next-line
            console.log('Validation success!');
            // eslint-disable-next-line
            console.log('Submit handler data: ', data);
            // eslint-disable-next-line
            console.log('=====');
        },
    });

    return (
        <form
            className="form"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.submitForm();
            }}
        >
            <TextInput
                label={'name'}
                value={form.values.name}
                touched={form.touched.name}
                onFocus={(e) => {
                    const { value } = e.currentTarget;
                    form.setTouched({ name: value });
                }}
                onChange={(e) => {
                    const { value } = e.currentTarget;
                    form.setValues({ name: value });
                    form.setMessages({ name: value });
                }}
                onBlur={(e) => {
                    const { value } = e.currentTarget;
                    form.asyncSetMessages({ name: value });
                }}
                error={form.errors.name}
                warning={form.warnings.name}
                asyncError={form.asyncErrors.name}
                asyncWarning={form.asyncWarnings.name}
            />
            <TextInput
                label={'surname'}
                value={form.values.surname}
                touched={form.touched.surname}
                onFocus={(e) => {
                    const { value } = e.currentTarget;
                    form.setTouched({ surname: value });
                }}
                onChange={(e) => {
                    const { value } = e.currentTarget;
                    form.setValues({ surname: value });
                    form.setMessages({ surname: value });
                }}
                onBlur={(e) => {
                    const { value } = e.currentTarget;
                    form.asyncSetMessages({ surname: value });
                }}
                error={form.errors.surname}
                warning={form.warnings.surname}
                asyncError={form.asyncErrors.surname}
                asyncWarning={form.asyncWarnings.surname}
            />

            <TextInput
                label={'email'}
                value={form.values.mail}
                touched={form.touched.mail}
                onFocus={(e) => {
                    const { value } = e.currentTarget;
                    form.setTouched({ mail: value });
                }}
                onChange={(e) => {
                    const { value } = e.currentTarget;
                    form.setValues({ mail: value });
                    form.setMessages({ mail: value });
                }}
                onBlur={(e) => {
                    const { value } = e.currentTarget;
                    form.asyncSetMessages({ mail: value });
                }}
                error={form.errors.mail}
                warning={form.warnings.mail}
                asyncError={form.asyncErrors.mail}
                asyncWarning={form.asyncWarnings.mail}
            />

            <Checkbox
                label={'react'}
                checked={form.values.react}
                touched={form.touched.react}
                onFocus={(e) => {
                    const { checked } = e.currentTarget;
                    form.setTouched({ react: checked });
                }}
                onChange={(e) => {
                    const { checked } = e.currentTarget;
                    form.setValues({ react: checked });
                    form.setMessages({ react: checked });
                }}
                onBlur={(e) => {
                    const { checked } = e.currentTarget;
                    form.asyncSetMessages({ react: checked });
                }}
                error={form.errors.react}
                warning={form.warnings.react}
                asyncError={form.asyncErrors.react}
                asyncWarning={form.asyncWarnings.react}
            />

            <div>
                <button type="submit" disabled={!form.dirty || form.isChecking || form.isSubmitting}>
                    Submit!
                </button>
            </div>
            {form.isChecking && <div className="overlay">checking validity...</div>}
            {form.isSubmitting && <div className="overlay">submitting...</div>}
        </form>
    );
};

export default Form;

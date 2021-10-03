import React from 'react';
import useForm from 'lib';
import { initialValues } from './config';
import "./index.css";
import { asyncValidators } from './asyncCheckers';
import { validators, warningators } from './checkers';

const Form: React.FC = () => {
    const form = useForm({
        initialDirty: true,
        initialValues,
        asyncValidators: asyncValidators,
        validators: validators,
        warningators: warningators,
        onSubmitFail: async (data) => {
            console.log("=====");
            console.log("Validation failure.");
            console.log("Failure handler data: ", data);
            console.log("=====")
        },
        onSubmit: async (data) => {
            console.log("=====");
            console.log("Validation success!");
            console.log("Submit handler data: ", data);
            console.log("=====")
        }
    });

    const setName = (e: React.FormEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        form.setFields({ name: text });
    }

    const setSurname = (e: React.FormEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        form.setFields({ surname: text });
    }

    const setMail = (e: React.FormEvent<HTMLInputElement>) => {
        const text = e.currentTarget.value;
        form.setFields({ mail: text });
    }

    const setReact = (e: React.FormEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked;
        form.setFields({ react: checked });
    }

    const nameError = form.asyncErrors.name || form.errors.name;
    const surnameError = form.asyncErrors.surname || form.errors.surname;
    const mailError = form.asyncErrors.mail || form.errors.mail;
    const reactError = form.asyncErrors.react || form.errors.name;

    const nameWarning = form.asyncWarnings.name || form.warnings.name;
    const surnameWarning = form.asyncWarnings.surname || form.warnings.surname;
    const mailWarning = form.asyncWarnings.mail || form.warnings.mail;
    const reactWarning = form.asyncWarnings.react || form.warnings.react;

    return (
        <form onSubmit={
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                form.submitForm();
            }
        }>

            <label className="field">
                <div>
                    Set name:
                </div>
                <input value={form.values.name} onChange={setName} />
                <div>
                    {nameError && <div className='errorMsg'>{nameError}</div>}
                    {nameWarning && <div className='warningMsg'>{nameWarning}</div>}
                </div>
            </label>

            <label className="field">
                <div>
                    Set surname:
                </div>
                <input value={form.values.surname} onChange={setSurname} />
                <div>
                    {surnameError && <div className='errorMsg'>{surnameError}</div>}
                    {surnameWarning && <div className='warningMsg'>{nameWarning}</div>}
                </div>
            </label>

            <label className="field">
                <div>
                    Set email:
                </div>
                <input value={form.values.mail} onChange={setMail} />
                <div>
                    {mailError && <div className='errorMsg'>{mailError}</div>}
                    {mailWarning && <div className='warningMsg'>{mailWarning}</div>}
                </div>
            </label>

            <label className="field">
                <div>
                    Has React knowledge:
                </div>
                <input checked={form.values.react} type="checkbox" onChange={setReact} />
                <div>
                    {reactError && <div className='errorMsg'>{reactError}</div>}
                    {reactWarning && <div className='warningMsg'>{reactWarning}</div>}
                </div>
            </label>

            <div>
                {form.isChecking && 'Checking...'}
                {form.isSubmitting && 'Submitting...'}
                <button
                    type="submit"
                    disabled={!form.dirty || form.isChecking || form.isSubmitting}
                >
                    Submit!
                </button>
            </div>
        </form>
    )
}

export default Form;
import clsx from 'clsx';
import { InputTextarea } from 'primereact/inputtextarea';
import { useMemo } from 'react';

export const Textarea = props => {
    const { name, label, errors, className, touched, ...other } = props;

    const isError = useMemo(
        () => touched && errors && touched[name] && errors[name],
        [errors, name, touched]
    );

    return (
        <div className={clsx('flex flex-column gap-2', className)}>
            <label htmlFor={name}>{label}</label>
            <InputTextarea
                id={name}
                aria-describedby={`${name}-help`}
                className={clsx(isError && 'p-invalid')}
                {...other}
            />
            <small id={`${name}-help`} className="text-red-300">
                {isError && errors[name]}
            </small>
        </div>
    );
};

export default Textarea;

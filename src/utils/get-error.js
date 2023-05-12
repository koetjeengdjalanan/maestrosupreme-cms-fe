export function getErrors(touched, errors, name) {
    return !!(touched && errors && touched[name] && errors[name]);
}

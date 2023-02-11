export function combineKeys(params, prefix = '') {
    const result = {};
    for (const key in params) {
        if (typeof params[key] !== 'object') {
            result[prefix + key] = params[key];
        } else {
            const combinedSubParams = combineKeys(params[key], key + '.');
            for (const subKey in combinedSubParams) {
                result[prefix + subKey] = combinedSubParams[subKey];
            }
        }
    }
    return result;
}

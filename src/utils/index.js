export const isValidDate = d => {
    return d instanceof Date && !isNaN(d);
};

/**
 * Generate form data from an object
 */
export function getFormData(data) {
  const form = new FormData();

  if (!Object.keys(data || {}).length) {
    return form;
  }

  Object.entries(data || {}).forEach(([key, value]) => form.append(key, value));

  return form;
}

const getStoredValue = field => {
  if (!field) {
    return;
  }
  const storedValue = localStorage.getItem(field);
  return storedValue ? (typeof storedValue === 'string' ? storedValue : JSON.parse(storedValue)) : [];
};

const saveToLocale = (value, field) => {
  if (!field && !value) {
    return;
  }
  localStorage.setItem(field, typeof value === 'string' ? value : JSON.stringify(value));
};

const clearStorage = field => {
  if (!field) {
    return;
  }

  localStorage.setItem(field, '');
};

export { getStoredValue, saveToLocale, clearStorage };

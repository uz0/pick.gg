export default (initialFields, newFields) => {
  const changedFields = {};

  for (const field in initialFields) {
    if (field === '_id') {
      continue;
    }

    if (initialFields[field] !== newFields[field]) {
      changedFields[field] = newFields[field];
    }
  }

  return changedFields;
};

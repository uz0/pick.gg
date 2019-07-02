export default (initialFields, newFields) => {
  let changedFields = {};

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

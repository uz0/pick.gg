export default model => {
  const fields = [];
  model.schema.eachPath(path => fields.push(path));
  return fields;
};

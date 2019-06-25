export default model => {
  let fields = [];
  model.schema.eachPath(path => fields.push(path));
  return fields;
}
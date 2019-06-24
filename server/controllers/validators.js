export const isPropertyValueUnique = async (property, model) => {
  const key = Object.keys(property)[0];
  const value = Object.values(property)[0];

  if(!value){
    return true;
  }

  const entity = await model.findOne(property);

  if (entity) {
    throw new Error(`Entity with key: ${key} and value: ${value} is already exist`);
  }
  
  return true;
};

export const isEntityExists = async (_id, model) => {
  const entity = await model.findById(_id);
  
  if(!entity){
    throw new Error(`Entity with _id: ${_id} doesn't exist`);
  }

  return true;
}
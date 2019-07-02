import getModelFields from './helpers/getModelFields';
import difference from 'lodash/difference';

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
  let isRequestSucces = false;

  try {
    const entity = await model.findById(_id);
    isRequestSucces = true;
  } catch(erorr){

  }
  
  if(!isRequestSucces){
    throw new Error(`Entity with _id: ${_id} doesn't exist`);
  }

  return true;
}

export const isRequestHasCorrectFields = (requestFields, model) => {
  const modelFields = getModelFields(model);
  const diff = difference(requestFields, modelFields);

  if(diff.length){
    throw new Error(`${model.modelName} shouldn't contain ${diff.join(', ')} fields`);
  }

  return true;
}

export const isUserHasToken = (value, req) => {
  if(req.decoded){
    return true;
  }

  throw new Error(`You are not authorized`);
}
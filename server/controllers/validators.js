import getModelFields from './helpers/getModelFields';
import difference from 'lodash/difference';

export const isPropertyValueUnique = async (property, model) => {
  const key = Object.keys(property)[0];
  const value = Object.values(property)[0];

  if (!value) {
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
    await model.findById(_id);
    isRequestSucces = true;
  } catch (erorr) {

  }

  if (!isRequestSucces) {
    throw new Error(`Entity with _id: ${_id} doesn't exist`);
  }

  return true;
};

const convertObjectToDotNotation = object => {
  var res = {};

  (function recurse (obj, current) {
    for (var key in obj) {
      const value = obj[key];
      const newKey = (current ? `${current}.${key}` : key);

      if (value && typeof value === 'object') {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  })(object);

  return Object.keys(res);
};

export const isRequestHasCorrectFields = (requestFields, model) => {
  const modelFields = getModelFields(model);
  const diff = difference(convertObjectToDotNotation(requestFields), modelFields);

  if (diff.length) {
    throw new Error(`${model.modelName} shouldn't contain ${diff.join(', ')} fields`);
  }

  return true;
};

export const isUserHasToken = (value, req) => {
  if (req.decoded) {
    return true;
  }

  throw new Error('You are not authorized');
};

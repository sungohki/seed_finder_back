export const toCamelCase = (snake_case: string) => {
  // Convert snake_case to camelCase
  return snake_case.replace(/_([a-z])/g, (match, letter) =>
    letter.toUpperCase()
  );
};

export const convertKeysToCamelCase = (obj: any) => {
  // Convert all propety names of Obj from snake_case to camelCase
  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelCaseKey = toCamelCase(key);
    acc[camelCaseKey] = obj[key];
    return acc;
  }, {});
};

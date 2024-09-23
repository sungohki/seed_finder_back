// 스네이크케이스를 카멜케이스로 변환하는 함수
export const toCamelCase = (snake_case: string) => {
  return snake_case.replace(/_([a-z])/g, (match, letter) =>
    letter.toUpperCase()
  );
};

// 객체의 모든 속성명을 스네이크케이스에서 카멜케이스로 변환
export const convertKeysToCamelCase = (obj: any) => {
  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelCaseKey = toCamelCase(key);
    acc[camelCaseKey] = obj[key];
    return acc;
  }, {});
};

export function findValueByKey(key: string, parameters?: { key?: string; value: string }[]): string | undefined {
  return parameters?.find(param => param.key?.trim()?.toLowerCase() === key?.trim().toLowerCase())?.value;
}

export function findRequiredValueByKey(key: string, parameters?: { key: string; value: string }[]) {
  const value = findValueByKey(key, parameters);
  if (!value) {
    throw new Error(`Required parameter ${key} was not found in CMS`);
  }
  return value;
}

export function stringsExistInArray(strings: string[], array: string[]) {
  const formattedArray = array.map(item => item.toLowerCase()),
    formattedStrings = strings.map(string => string.toLowerCase());

  return formattedStrings.some(string => formattedArray.includes(string));
}

export function findLongestArrayInArray<T extends Array<any>>(arr: T[]) {
  let longest = 0;
  let longestArr: T = [] as unknown as T;

  arr.forEach(item => {
    if (item.length > longest) {
      longest = item.length;
      longestArr = item;
    }
  });

  return longestArr;
}

export function findKeysWithAsterisk(items: any[]): { item: any; key: string }[] {
  return items.flatMap(item =>
    Object.entries(item).flatMap(([key, value]) => (value?.toString().includes('*') ? [{ key, item }] : [])),
  );
}

export function arraysAreEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

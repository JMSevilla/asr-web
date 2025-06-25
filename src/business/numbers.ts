export const sequencedNumber = (number: number) => {
  const numberString = number.toString();
  const lastDigit = numberString.slice(-1);
  const twoLastDigits = numberString.slice(-2);
  const exceptions = ['11', '12', '13'];

  if (!exceptions.includes(twoLastDigits)) {
    if (lastDigit === '1') {
      return `${numberString}st`;
    }
    if (lastDigit === '2') {
      return `${numberString}nd`;
    }
    if (lastDigit === '3') {
      return `${numberString}rd`;
    }
  }

  return `${numberString}th`;
};

export const average = (arr: number[]) => arr.reduce((p, c) => p + c, 0) / arr.length;

export const sum = (arr: number[]) => arr.reduce((p, c) => p + c, 0);

export const isValidPercentage = (percentage?: number) =>
  percentage === undefined || (percentage >= 0 && percentage <= 100);

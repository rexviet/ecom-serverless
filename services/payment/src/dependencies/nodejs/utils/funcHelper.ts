import moment from 'moment';

export const formatDate = (date: string | number, format = 'll'): string => {
  return moment(date).format(format);
};

export const isNumber = (num: number): boolean => {
  return typeof num === 'number';
};

export const convertCurrency = (cents: number): string => {
  return '$' + (cents / 100).toFixed(2);
};

export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomWithPercent = (percent: number): boolean => {
  return randomInRange(1, 100) <= percent;
};

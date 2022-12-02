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

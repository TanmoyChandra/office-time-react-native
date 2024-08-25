// utils/dateUtils.js

import { format } from 'date-fns';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'do MMM, yy (eeee)');
};

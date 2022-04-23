import moment from 'moment';

export const formatDate = (date) => {
  let newDate = moment.utc(date)?.format('MMMM Do YYYY');
  return newDate;
};

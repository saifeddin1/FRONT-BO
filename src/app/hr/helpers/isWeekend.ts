import moment from 'moment';

export const isWeekend = (date) => {
  let newDate = moment(date); //?.format('MMMM Do YYYY');
  // console.log(newDate, newDate.day());

  return newDate.day() === 1 || newDate.day() === 0;
};

import moment from 'moment';

export const monthCheck = (ym) => {
  //   let newDate = moment(date); //?.format('MMMM Do YYYY');
  let m = ym.split('-')[1];
  return parseInt(m) === new Date().getMonth() + 1;
};

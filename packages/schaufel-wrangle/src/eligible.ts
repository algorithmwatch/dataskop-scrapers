import dayjs from 'dayjs';
import _ from 'lodash';

const isEligibleToDonate = (dump: any) => {
  const dobString = _.get(dump, [
    'Profile',
    'Profile Information',
    'ProfileMap',
    'birthDate',
  ]);

  // parse 01-Sep-1990 and 1-Sep-1990
  const dob = dayjs(dobString, ['DD-MMM-YYYY', 'D-MMM-YYYY']);

  // You have to be over 18 to donate
  return dayjs().diff(dob, 'year', true) > 18;
};

export { isEligibleToDonate };

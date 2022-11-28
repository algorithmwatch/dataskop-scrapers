import _ from 'lodash';
import data from '../../schaufel-core/test/data/filter8000-22-07-2022.json';
import { isEligibleToDonate } from '../src/eligible';

describe('filter8000 dump from 22-07-2022', () => {
  test('Is eligible to donate', () => {
    expect(isEligibleToDonate(data)).toBeTruthy();
  });

  test('Not eligible to donate if too young', () => {
    const malData = _.cloneDeep(data);

    _.set(
      malData,
      ['Profile', 'Profile Information', 'ProfileMap', 'birthDate'],
      '01-Nov-2010',
    );

    expect(isEligibleToDonate(malData)).toBeFalsy();
  });
});

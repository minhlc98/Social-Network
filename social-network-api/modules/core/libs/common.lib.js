import _ from 'lodash';
import moment from 'moment';

export const timeLog = (time = new Date(), format = 'DD/MM/YYYY HH:mm:ss') => moment(time).utcOffset(7).format(format);

export const asyncRun = async (promise) => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
};

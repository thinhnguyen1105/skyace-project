import { PageableQuery } from '../interfaces';
import * as _ from 'lodash';
import config from '../../config';

const validatePagination = <T extends PageableQuery>(query: T) => {
  const pageNumber = query.pageNumber
    ? _.parseInt(query.pageNumber.toString())
    : 1;
  const pageSize = query.pageSize
    ? _.parseInt(query.pageSize.toString())
    : config.app.defaultPageSize;
  return {
    ...(query as any),
    pageSize,
    pageNumber,
  } as T;
};

export default validatePagination;

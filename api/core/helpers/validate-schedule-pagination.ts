import { SchedulePageableQuery } from '../interfaces';

const validateSchedulePagination = <T extends SchedulePageableQuery>(query: T) => {
  const start = query.start ? new Date(query.start) : new Date();
  const end = query.end ? new Date(query.end) : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    ...(query as any),
    start,
    end,
  } as T;
};

export default validateSchedulePagination;

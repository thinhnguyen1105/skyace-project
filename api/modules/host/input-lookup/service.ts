import { dataLookup } from './lookup-data';
import courseService from '../../elearning/courses/service';

const find = async (tenantId: string) => {
  const courseSubjects = await courseService.getAllSubjects(tenantId);
  dataLookup.course.subject = courseSubjects.map((val, index) => {
    return {
      content : val,
      _id : index + 1,
      value : val
    };
  });
  return dataLookup;
};

export default {
  find,
};
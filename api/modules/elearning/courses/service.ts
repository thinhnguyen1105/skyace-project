import * as Joi from 'joi';
import * as courseRepository from './repository';
import { IGetAllCourses, IGetCourseDetail, ICreateCourseInput, IUpdateCourseInput, IDeleteCourseInput, ISearchAllFieldInput } from './interface';
import * as levelRepository from '../levels/repository';
import * as gradeRepository from '../grades/repository';
import * as subjectRepository from '../subjects/repository';
import * as mongoose from 'mongoose';

const getAllCourses = async (tenantId: string): Promise<IGetAllCourses> => {
  return await courseRepository.getAllCourses(tenantId);
};

const findCourseById = async (courseId: string): Promise<IGetCourseDetail> => {
  if (!courseId) {
    throw new Error('Bad request');
  }

  return await courseRepository.getCourseById(courseId);
};

const findCourseByIdOldStructure = async (courseId: string) : Promise<IGetCourseDetail> => {
  if (!courseId) {
    throw new Error('Bad request');
  }
  return await courseRepository.getCourseByIdOldStructure(courseId);
}

const createCourse = async (body: ICreateCourseInput, tenantId: string): Promise<IGetCourseDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    country: Joi.string().required(),
    level: Joi.string().required(),
    grade: Joi.string().required(),
    subject: Joi.string().required(),
    session: Joi.number().required(),
    hourPerSession: Joi.number().required(),
    isDeleted: Joi.boolean().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  // Save to db
  return await courseRepository.createNewCourse({ ...body, tenant_id: tenantId, isConverted: true });
};

const updateCourse = async (body: IUpdateCourseInput, tenantId: string): Promise<any> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    country: Joi.string(),
    tenant_id: Joi.string(),
    level: Joi.string(),
    grade: Joi.string(),
    subject: Joi.string(),
    session: Joi.number(),
    hourPerSession: Joi.number(),
    isDeleted: Joi.boolean(),
    // academicStart: Joi.number(),
    // academicEnd: Joi.number()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Course Exist
  const existedCourse = await courseRepository.getCourseById(body._id);
  if (!existedCourse) {
    throw new Error('Course does not exist!');
  }

  // Update
  return await courseRepository.updateCourse(body, tenantId);
};

const deleteCourse = async (body: IDeleteCourseInput, tenantId: string): Promise<void> => {
  // Check Course ID
  if (!body._id) {
    throw new Error('Course ID is empty');
  }

  // Check if Course exist
  const existedCourse = await courseRepository.getCourseById(body._id);
  if (!existedCourse) {
    throw new Error('Course does not exist!');
  }

  await courseRepository.deleteCourse(body, tenantId);
};

const trutlyDeleteCourse = async (body: IDeleteCourseInput, tenantId: string): Promise<void> => {
  // Check Course ID
  if (!body._id) {
    throw new Error('Course ID is empty');
  }

  // Check if Course exist
  const existedCourse = await courseRepository.getCourseById(body._id);
  if (!existedCourse) {
    throw new Error('Course does not exist!');
  }

  await courseRepository.trutlyDeleteCourse(body, tenantId);
};

const searchAllFields = async (query: ISearchAllFieldInput, tenantId: string): Promise<IGetAllCourses> => {
  if (!query.keyword) {
    return await courseRepository.getAllCourses(tenantId);
  }

  return await courseRepository.searchAllFields(query, tenantId);
};

const filterCourse = async (query: any, tenantId: string): Promise<IGetAllCourses> => {
  if (!query) {
    return await courseRepository.getAllCourses(tenantId);
  }

  return await courseRepository.filterCourse(query, tenantId);
};

const getAllSubjects = async (tenantId: string): Promise<any> => {
  return await courseRepository.getAllSubjects(tenantId);
};

const getAllCountries = async (tenantId: string): Promise<any> => {
  return await courseRepository.getAllCountries(tenantId);
};

const regenerate = async (course: any): Promise<any> => {
  let updateData = {
    _id: course._id,
    isConverted: true
  } as any;
  if(course.subject) {
    const subject = await subjectRepository.findOne(course.subject);
    if (subject) {
      updateData = {
        ...updateData,
        subject: mongoose.Types.ObjectId(subject._id)
      }
    } else {
      const newSubject = await subjectRepository.create(course.tenant_id, {
        name: course.subject,
        slug: slugify(course.subject),
        isActive: true
      });
      updateData = {
        ...updateData,
        subject: mongoose.Types.ObjectId(newSubject._id)
      }
    }
  }
  if (course.level) {
    const level = await levelRepository.findOne(course.level);
    if (level) {
      updateData = {
        ...updateData,
        level: mongoose.Types.ObjectId(level._id)
      }
      if (course.grade) {
        const grade = await gradeRepository.findOne(course.grade);
        if (grade) {
          updateData = {
            ...updateData,
            grade: mongoose.Types.ObjectId(grade._id),
          }
        } else {
          const newGrade = await gradeRepository.create(course.tenant_id , {
            name: course.grade,
            slug: slugify(course.grade),
            isActive: true,
            level: level._id
          })
          updateData = {
            ...updateData,
            grade: mongoose.Types.ObjectId(newGrade._id)
          }
        }
      }
    } else {
      const newLevel = await levelRepository.create(course.tenant_id, {
        name: course.level,
        slug: slugify(course.level),
        isActive: true
      });
      updateData = {
        ...updateData,
        level: mongoose.Types.ObjectId(newLevel._id)
      }
      if (course.grade) {
        const grade = await gradeRepository.findOne(course.grade);
        if (grade) {
          updateData = {
            ...updateData,
            grade: mongoose.Types.ObjectId(grade._id),
          }
        } else {
          const newGrade = await gradeRepository.create(course.tenant_id , {
            name: course.grade,
            slug: slugify(course.grade),
            isActive: true,
            level: newLevel._id
          })
          updateData = {
            ...updateData,
            grade: mongoose.Types.ObjectId(newGrade._id)
          }
        }
      }
    }
  }
  await courseRepository.updateCourse(updateData, course.tenant_id);
}

const regenerateCourseData = async () : Promise<any> => {

  // Stacking async functions is not the right way!
  // const courses = await courseRepository.getAll();
  // const levels = await levelRepository.get();
  // const subjects = await subjectRepository.get();
  // const grades = await gradeRepository.get();
  // const promises = courses.map((val) => {
  //   if (val.subject && val.level && val.grade) {
  //     let createData = [] as any;
  //     let updateData = {
  //       _id: val._id
  //     } as any;
  //     const subject = subjects.filter((v) => v.name === val.subject || String(v._id) === String(val.subject));
      
  //     if (subject && subject.length) {
  //       updateData = {
  //         ...updateData,
  //         subject: mongoose.Types.ObjectId(subject[0]._id)
  //       };
  //     } else {
  //       let createPromise = subjectRepository.create(val.tenant_id, {
  //         name: val.subject,
  //         slug: slugify(val.subject),
  //         isActive: true
  //       })
  //       createData.push(createPromise);
  //     }
  //     const level = levels.filter((lv) => lv.name == val.level || lv._id == val.level);
  //     const grade = grades.filter((v) => (v.name == val.grade || v._id == val.grade) && (v.level.name == val.level || v.level._id == val.level));
  //     if (level && level.length) {
  //       updateData = {
  //         ...updateData,
  //         level: mongoose.Types.ObjectId(level[0]._id)
  //       }
  //       if (grade && grade.length) {
  //         updateData = {
  //           ...updateData,
  //           grade: mongoose.Types.ObjectId(grade[0]._id)
  //         }
  //       } else {
  //         let createGrade = gradeRepository.create(val.tenant_id, {
  //           name: val.grade,
  //           slug: slugify(val.grade),
  //           isActive: true,
  //           level: level[0]._id
  //         })
  //         createData.push(createGrade)
  //       }
  //     } else {
  //       /* Create level
  //       */
  //       let createLevel = levelRepository.create(val.tenant_id, {
  //         name: val.level,
  //         slug: slugify(val.level),
  //         isActive: true
  //       })
  //       createData.push(createLevel);
  //     }
  //     let updatePromise = courseRepository.updateCourse(updateData, val.tenant_id);
  //     return createData.length ? createData : [updatePromise];
  //   }
  // });
  // let mergedPromise = [].concat.apply([], promises);
  // return await Promise.all(mergedPromise);

  const courses = await courseRepository.getAll();
  // const promises = courses.map((val) => regenerate(val));
  // return await Promise.all(promises);
  async function process(array) {
    for (const item of array) {
      await regenerate(item);
    }
  }
  return await process(courses);
}

function slugify(string) {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
  const p = new RegExp(a.split('').join('|'), 'g')
  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with ‘and’
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple — with single -
    .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
}

export default {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  searchAllFields,
  filterCourse,
  getAllSubjects,
  getAllCountries,
  trutlyDeleteCourse,
  findCourseById,
  regenerateCourseData,
  findCourseByIdOldStructure
};
import { IGetCourseForTutorDetail, ICreateCourseForTutorInput, IUpdateCourseForTutorInput, ICourseForTutor } from './interface';
import CourseForTutorModel from './mongoose';
import * as mongoose from 'mongoose';
import CourseModel from '../courses/mongoose';
import UsersModel from '../../auth/users/mongoose';
import { synchronizeUsers } from '../../../elasticsearch/service';

const getById = async (_id: string): Promise<IGetCourseForTutorDetail> => {
  try {
    let result = await CourseForTutorModel.findOne({ _id: _id }).populate({
      path: 'course',
      model: 'Course',
      populate: [{
        path: 'level',
        model: 'Level',
      }, {
        path: 'subject',
        model: 'Subject'
      }, {
        path: 'grade',
        model: 'Grade'
      }]
    }).exec() as any;
    let course = JSON.parse(JSON.stringify(result));
    if (course.course) {
      course.course.level = course.course.level ? course.course.level.name : undefined;
      course.course.grade = course.course.grade ? course.course.grade.name : undefined;
      course.course.subject = course.course.subject ? course.course.subject.name : undefined;
    }
    return course;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getAll = async (tenantId: string): Promise<any> => {
  try {
    let results = await CourseForTutorModel.find({ tenant_id: tenantId, isDeleted: false, $or: [{ isGroup: { $exists: false } }, { isGroup: false }] })
      .populate({
        path: 'course',
        model: 'Course',
        populate: [{
          path: 'level',
          model: 'Level',
        }, {
          path: 'subject',
          model: 'Subject'
        }, {
          path: 'grade',
          model: 'Grade'
        }]
      }).exec();

    let clone = JSON.parse(JSON.stringify(results));
    clone = clone.map((val) => {
      let course = JSON.parse(JSON.stringify(val));
      if (course.course) {
        course.course = {
          ...course.course,
          level: course.course.level ? course.course.level.name : undefined,
          grade: course.course.grade ? course.course.grade.name : undefined,
          subject: course.course.subject ? course.course.subject.name : undefined,
        }
      }
      return course;
    })
    return clone;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTutorId = async (tutorId: string, tenantId: string): Promise<any> => {
  try {
    let results = await CourseForTutorModel.find({ tenant_id: tenantId, tutor: new mongoose.Types.ObjectId(tutorId), isDeleted: false, $or: [{ isGroup: { $exists: false } }, { isGroup: false }] })
      .populate({
        path: 'course',
        model: 'Course',
        populate: [{
          path: 'level',
          model: 'Level',
        }, {
          path: 'subject',
          model: 'Subject'
        }, {
          path: 'grade',
          model: 'Grade'
        }]
      }).exec();
    let clone = JSON.parse(JSON.stringify(results));
    clone = clone.map((val) => {
      let course = JSON.parse(JSON.stringify(val));
      if (course.course) {
        course.course = {
          ...course.course,
          level: course.course.level ? course.course.level.name : undefined,
          grade: course.course.grade ? course.course.grade.name : undefined,
          subject: course.course.subject ? course.course.subject.name : undefined,
        }
      }
      return course;
    })
    return clone;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const createCourseForTutor = async (body: ICreateCourseForTutorInput): Promise<any> => {
  try {
    if (body.course) {
      const courseExisted = await CourseModel.findOne({ _id: new mongoose.Types.ObjectId(body.course), isDeleted: false });
      if (!courseExisted) throw new Error("Cannot find matching course!");
    }
    const tutorExisted = await UsersModel.findOne({ _id: new mongoose.Types.ObjectId(body.tutor) });
    if (tutorExisted) {
      return new Promise((resolve, reject) => {
        const course = new CourseForTutorModel(body);
        course.save((err, doc) => {
          if (err) {
            reject(err);
          } else {
            UsersModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(body.tutor) }, { $push: { courseForTutor: new mongoose.Types.ObjectId(doc._id) } }, { new: true })
              .then(() => {
                CourseForTutorModel.findOne({ _id: doc._id })
                  .populate({
                    path: 'course',
                    model: 'Course',
                    populate: [{
                      path: 'level',
                      model: 'Level',
                    }, {
                      path: 'subject',
                      model: 'Subject'
                    }, {
                      path: 'grade',
                      model: 'Grade'
                    }]
                  })
                  .populate('tutor')
                  .then((result) => {
                    let course = JSON.parse(JSON.stringify(result));
                    if (course && course.course) {
                      course.course.level = course.course.level ? course.course.level.name : undefined;
                      course.course.grade = course.course.grade ? course.course.grade.name : undefined;
                      course.course.subject = course.course.subject ? course.course.subject.name : undefined;
                    }
                    resolve(course as any);
                  });
              });
          }
        });
      });
    } else {
      throw new Error("Cannot find matching tutor!");
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCourseForTutor = async (body: IUpdateCourseForTutorInput): Promise<ICourseForTutor> => {
  try {
    const result = await CourseForTutorModel.findOneAndUpdate({ _id: body._id, isDeleted: false }, { $set: body }, { new: true })
      .populate({
        path: 'course',
        model: 'Course',
        populate: [{
          path: 'level',
          model: 'Level',
        }, {
          path: 'subject',
          model: 'Subject'
        }, {
          path: 'grade',
          model: 'Grade'
        }]
      }).populate('tutor').exec() as any;
    console.log(result);
    await synchronizeUsers({ _id: new mongoose.Types.ObjectId(result.tutor._id) });
    let course = JSON.parse(JSON.stringify(result));
    if (course && course.course) {
      course.course.level = course.course.level ? course.course.level.name : undefined;
      course.course.grade = course.course.grade ? course.course.grade.name : undefined;
      course.course.subject = course.course.subject ? course.course.subject.name : undefined;
    }
    return course;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteCourseForTutor = async (_id: string, tenantId: string): Promise<void> => {
  try {
    const result = await CourseForTutorModel.findOneAndUpdate({ _id: _id, tenant_id: tenantId }, { $set: { isDeleted: true } }, { new: true }).exec() as any;
    await UsersModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(result.tutor) }, { $pull: { courseForTutor: new mongoose.Types.ObjectId(result._id) } }, { new: true });
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};
const trutlyDeleteCourseForTutor = async (_id: string, tenantId: string): Promise<void> => {
  try {
    await CourseForTutorModel.deleteOne({ _id: _id, tenant_id: tenantId }).exec() as any;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const addTuition = async (_id: string, tenantId: string, tuitionId: string): Promise<void> => {
  try {
    await CourseForTutorModel.findOneAndUpdate({ _id: _id, tenant_id: tenantId }, { $push: { tuitions: tuitionId } }, { new: true }).exec();
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const createGroupCourse = async (body: ICreateCourseForTutorInput): Promise<any> => {
  try {
    if (body.course) {
      const courseExisted = await CourseModel.findOne({ _id: new mongoose.Types.ObjectId(body.course), isDeleted: false });
      if (!courseExisted) throw new Error("Cannot find matching course!");
    }
    return new Promise((resolve, reject) => {
      const course = new CourseForTutorModel(body);
      course.save((err, doc) => {
        if (err) {
          reject(err);
        } else {
          CourseForTutorModel.findOne({ _id: doc._id })
            .populate({
              path: 'course',
              model: 'Course',
              populate: [{
                path: 'level',
                model: 'Level',
              }, {
                path: 'subject',
                model: 'Subject'
              }, {
                path: 'grade',
                model: 'Grade'
              }]
            })
            .populate('tutor')
            .then((result) => {
              let course = JSON.parse(JSON.stringify(result));
              if (course && course.course) {
                course.course.level = course.course.level ? course.course.level.name : undefined;
                course.course.grade = course.course.grade ? course.course.grade.name : undefined;
                course.course.subject = course.course.subject ? course.course.subject.name : undefined;
              }
              resolve(course as any);
            });
        }
      });
    });
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  createCourseForTutor,
  updateCourseForTutor,
  getById,
  getAll,
  deleteCourseForTutor,
  findByTutorId,
  addTuition,
  createGroupCourse,
  trutlyDeleteCourseForTutor
};
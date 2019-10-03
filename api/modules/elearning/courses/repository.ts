import CourseModel from './mongoose';
import { IGetAllCourses, IGetCourseDetail, ICreateCourseInput, IUpdateCourseInput, IDeleteCourseInput, ISearchAllFieldInput, IGetAllSubjects, IGetAllCountries } from './interface';
import * as mongoose from 'mongoose';
import { synchronizeUsers } from '../../../elasticsearch/service';
import LevelModel from '../levels/mongoose';
import SubjectModel from '../subjects/mongoose';
import GradeModel from '../grades/mongoose';

const getAllCourses = async (tenantId: string): Promise<IGetAllCourses> => {
  try {
    const classes = await CourseModel.find({ tenant_id: tenantId, isDeleted: false })
      .populate('subject')
      .populate('level')
      .populate('grade')
      .sort({ country: 1, "level.name": 1, "grade.name": 1, "subject.name": 1 }).exec();
    return classes;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getCourseById = async (_id: string): Promise<IGetCourseDetail> => {
  try {
    const classes = await CourseModel.findOne({ _id: _id }).exec();
    return classes as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const getCourseByIdOldStructure = async (_id: string): Promise<IGetCourseDetail> => {
  try {
    const classes = await CourseModel.findOne({ _id: _id }).populate('level').populate('grade').populate('subject').exec();
    let dataReturn = JSON.parse(JSON.stringify(classes));
    if (dataReturn.level) dataReturn.level = dataReturn.level.name;
    if (dataReturn.grade) dataReturn.grade = dataReturn.grade.name;
    if (dataReturn.subject) dataReturn.subject = dataReturn.subject.name;
    return dataReturn as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createNewCourse = async (body: ICreateCourseInput): Promise<IGetCourseDetail> => {
  try {
    const newCourse = new CourseModel(body);
    const result = await newCourse.save();
    return await CourseModel.findOne({ _id: result._id }).populate('subject').populate('level').populate('grade').exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createTrialCourse = async (body: { hourPerSession: number, tenant: string }): Promise<any> => {
  const mongooseObject = mongoose.Types.ObjectId;
  try {
    let trialLevels = await LevelModel.findOne({
      name: 'trial',
    })
    if (!trialLevels) {
      trialLevels = await LevelModel.create({
        name: 'trial',
        slug: 'trial',
        tenant: body.tenant,
        isActive: true,
      })
    }
    let trialSubjects = await SubjectModel.findOne({
      name: 'trial',
    })
    if (!trialSubjects) {
      trialSubjects = await SubjectModel.create({
        name: 'trial',
        slug: 'trial',
        tenant: body.tenant,
        isActive: true,
      })
    }
    let trialGrades = await GradeModel.findOne({
      name: 'trial',
    })
    if (!trialGrades) {
      trialGrades = await GradeModel.create({
        name: 'trial',
        slug: 'trial',
        tenant: body.tenant,
        level: trialLevels._id,
        isActive: true,
      })
    }
    return await CourseModel.create({
      country: 'trial',
      grade: mongooseObject(trialGrades._id),
      subject: mongooseObject(trialSubjects._id),
      level: mongooseObject(trialLevels._id),
      hourPerSession: body.hourPerSession,
      tenant_id: body.tenant,
      session: 1,
      isDeleted: false,
      isActive: true,
      createdAt: new Date(),
      isConverted: true,
    })
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateCourse = async (body: IUpdateCourseInput, tenantId: string): Promise<any> => {
  try {
    const result = await CourseModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(body._id), tenant_id: tenantId }, { $set: body }, { new: true }).populate('subject').populate('level').populate('grade').exec();
    await synchronizeUsers({ courses: new mongoose.Types.ObjectId(body._id) });
    return result;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteCourse = async (body: IDeleteCourseInput, tenantId: string): Promise<void> => {
  try {
    await CourseModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(body._id), tenant_id: tenantId }, { $set: { isDeleted: true } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const trutlyDeleteCourse = async (body: IDeleteCourseInput, tenantId: string): Promise<void> => {
  try {
    await CourseModel.deleteOne({ _id: body._id, tenant_id: tenantId }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const searchAllFields = async (query: ISearchAllFieldInput, tenantId: string): Promise<IGetAllCourses> => {
  try {
    const levels = await LevelModel.find({ name: { $regex: query.keyword, $options: 'i' }, tenant: tenantId }).select('_id').exec();
    const subjects = await SubjectModel.find({ name: { $regex: query.keyword, $options: 'i' }, tenant: tenantId }).select('_id').exec();
    const grades = await GradeModel.find({ name: { $regex: query.keyword, $options: 'i' }, tenant: tenantId }).select('_id').exec();
    const queries = {
      $or: [
        {
          country: { $regex: query.keyword, $options: 'i' },
          tenant_id: tenantId,
          isDeleted: false
        },
        {
          level: { $in: levels.map(val => val._id) },
          tenant_id: tenantId,
          isDeleted: false
        },
        {
          grade: { $in: grades.map(val => val._id) },
          tenant_id: tenantId,
          isDeleted: false
        },
        {
          subject: { $in: subjects.map(val => val._id) },
          tenant_id: tenantId,
          isDeleted: false
        }
      ]
    };
    const results = await CourseModel.find(queries)
      .populate('subject')
      .populate('level')
      .populate('grade')
      .sort({ country: 1, "level.name": 1, "grade.name": 1, "subject.name": 1 }).exec();
    return results;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const filterCourse = async (query: any, tenantId: string): Promise<IGetAllCourses> => {
  try {
    let queryOptions = {} as any;
    if (query.country) {
      queryOptions.country = new RegExp(query.country, 'i');
    }
    if (query.level) {
      queryOptions.level = query.level;
    }
    if (query.grade) {
      queryOptions.grade = query.grade;
    }
    if (query.subject) {
      queryOptions.subject = query.subject;
    }
    const results = await CourseModel.find({ ...queryOptions, isDeleted: false, tenant_id: tenantId })
      .populate('subject')
      .populate('level')
      .populate('grade')
      .sort({ country: 1, "level.name": 1, "grade.name": 1, "subject.name": 1 }).exec();
    return results;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const getAllSubjects = async (tenantId): Promise<IGetAllSubjects> => {
  try {
    const subjects = await CourseModel.find({ isDeleted: false, tenant_id: tenantId }, ['subject'], { sort: { 'subject': 1 } }).exec();
    var onlySubject = subjects.map((value) => value.subject);
    var uniqElem = onlySubject.filter(function (val, index) {
      return onlySubject.indexOf(val) === index;
    });
    return uniqElem;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const getAllCountries = async (tenantId): Promise<IGetAllCountries> => {
  try {
    const countries = await CourseModel.find({ isDeleted: false, tenant_id: tenantId }, ['country'], { sort: { 'country': 1 } }).exec();
    var onlyCountry = countries.map((value) => value.country);
    var uniqElem = onlyCountry.filter(function (val, index) {
      return onlyCountry.indexOf(val) === index;
    });
    var dbCountries = uniqElem.map((val) => {
      return {
        name: val,
        value: val
      };
    });
    dbCountries.unshift({
      name: 'All countries',
      value: ""
    });
    return dbCountries;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const getAll = async (): Promise<any> => {
  try {
    const classes = await CourseModel.find({ isConverted: null }).exec();
    return classes;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  getAllCourses,
  getCourseById,
  createNewCourse,
  updateCourse,
  deleteCourse,
  searchAllFields,
  filterCourse,
  getAllSubjects,
  getAllCountries,
  trutlyDeleteCourse,
  getAll,
  createTrialCourse,
  getCourseByIdOldStructure
};
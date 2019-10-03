import TuitionsModel from './mongoose';
import * as courseForTutorRepository from '../course-for-tutor/repository';
import { IFindTuitionsResult, IFindTuitionsByUserIdQuery, ICreateTuitionInput, IFindTuitionDetail, IUpdateTuitionInput, IFinishTuition, IFindUncompletedTuitionsResult, ICancelTuition, IGetTuitions, IFindTuitionsQuery } from './interface';
import { synchronizeUsers } from '../../../elasticsearch/service';
import * as groupTuitionRepository from '../group-tuitions/repository';
import * as sessionRepository from '../sessions/repository';
import GroupTuitionModel from '../group-tuitions/mongoose';

const findTuitions = async (tenantId: string, query: IFindTuitionsQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({$and: [
      {tenant: tenantId},
      query.isCompleted !== undefined ? {isCompleted: query.isCompleted} : {},
      query.isCanceled !== undefined ? {isCanceled: query.isCanceled} : {},
      query.isPendingReview !== undefined ? {isPendingReview: query.isPendingReview} : {},
    ]})
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({$and: [
      {tenant: tenantId},
      query.isCompleted !== undefined ? {isCompleted: query.isCompleted} : {},
      query.isCanceled !== undefined ? {isCanceled: query.isCanceled} : {},
      query.isPendingReview !== undefined ? {isPendingReview: query.isPendingReview} : {},
    ]})
      .populate('courseForTutor')
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
      .populate('student')
      .populate('sessions')
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    return {
      total: total,
      data: dataReturned
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findAllTuitionsByStudentId = async (tenantId: string, query: {studentId: string, isCompleted?: boolean; isCanceled?: boolean, isPendingReview?: boolean}): Promise<IFindTuitionsResult> => {
  try {
    let options = [
      {tenant: tenantId},
      {student: query.studentId},
    ] as any;
    if (query.isCompleted !== undefined) {
      options.push({isCompleted: query.isCompleted})
    }
    if (query.isCanceled !== undefined) {
      options.push({isCanceled: query.isCanceled})
    }
    if (query.isPendingReview !== undefined) {
      options.push({isPendingReview: query.isPendingReview})
    }
    const totalPromise = TuitionsModel.find({$and: options})
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({$and: options})
      .populate('courseForTutor')
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
      .populate('sessions')
      .populate('tutor')
      .exec();

    // TODO : Query group tuitions of student
    // 
    const groupTuitionPromise = groupTuitionRepository.findByStudentId(tenantId, query.studentId, query.isCompleted, query.isCanceled);


    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findTuitionsByStudentIdInCalendar = async (tenantId: string, query: {studentId: string, isCompleted?: boolean; isCanceled?: boolean, isPendingReview?: boolean}): Promise<IFindTuitionsResult> => {
  try {
    const queries = {$and: [
      {tenant: tenantId},
      {student: query.studentId},
      ...(query.isCompleted !== undefined ? [{isCompleted: query.isCompleted}] : []),
      ...(query.isCanceled !== undefined ? [{isCanceled: query.isCanceled}] : []),
      ...(query.isPendingReview !== undefined ? [{isPendingReview: query.isPendingReview}] : []) 
    ]}
    const totalPromise = TuitionsModel.find(queries)
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find(queries)
      .populate('courseForTutor')
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
      .populate('sessions')
      .populate('tutor')
      .exec();

    // TODO : Query group tuitions of student
    // 
    const groupTuitionPromise = groupTuitionRepository.findByStudentId(tenantId, query.studentId, query.isCompleted, query.isCanceled);


    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findUncompletedTuitions = async (): Promise<IFindUncompletedTuitionsResult> => {
  try {
    const tuitionList = await TuitionsModel.find({ isCompleted: false }).populate('sessions').exec();
    return { tuitionList };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTutorId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: query.isCanceled }, { tutor: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: query.isCanceled }, { tutor: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .populate('student')
      .populate('sessions')
      .exec();

    const groupTuitionPromise = groupTuitionRepository.findByTutorId(tenantId, query.userId, query.isCompleted, query.isCanceled);

    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findRequestCancelByTutorId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { tutor: query.userId }, { tenant: tenantId }, { isPendingReview: true }] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { tutor: query.userId }, { tenant: tenantId }, { isPendingReview: true }] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .populate('student')
      .populate('sessions')
      .exec();


    const [total, data] = await Promise.all([totalPromise, dataPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    return {
      total: total,
      data: dataReturned
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByStudentId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { student: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { student: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .exec();

    const groupTuitionPromise = groupTuitionRepository.findByStudentId(tenantId, query.userId, query.isCompleted);

    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findRequestCancelByStudentId = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { student: query.userId }, { tenant: tenantId }, { isPendingReview: true }] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: false }, { student: query.userId }, { tenant: tenantId }, { isPendingReview: true }] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })
    console.log('data', data.length, dataReturned.length);

    return {
      total: total,
      data: dataReturned
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findCancelTuitionStudent = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: true }, { student: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: true }, { student: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }, {isPendingReview: {$ne: true}}] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .exec();

    const groupTuitionPromise = groupTuitionRepository.findByStudentId(tenantId, query.userId, query.isCompleted, true);

    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};
const findCancelTuitionTutor = async (tenantId: string, query: IFindTuitionsByUserIdQuery): Promise<IFindTuitionsResult> => {
  try {
    const totalPromise = TuitionsModel.find({ $and: [{ isCanceled: true }, { tutor: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }] })
      .countDocuments()
      .exec();

    const dataPromise = TuitionsModel.find({ $and: [{ isCanceled: true }, { tutor: query.userId }, { tenant: tenantId }, { isCompleted: query.isCompleted }] })
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('courseForTutor')
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
      .populate('student')
      .populate('sessions')
      .exec();

    const groupTuitionPromise = groupTuitionRepository.findByTutorId(tenantId, query.userId, query.isCompleted, true);

    const [total, data, groupTuitions] = await Promise.all([totalPromise, dataPromise, groupTuitionPromise]);
    const dataReturned = data.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const results = dataReturned.concat(groupTuitions).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      total: total + groupTuitions.length,
      data: results
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteOneTuition = async (tenantId: string, tuitionId: string): Promise<void> => {
  try {
    await TuitionsModel.deleteOne({ $and: [{ _id: tuitionId }, { tenant: tenantId }] }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTuitionId = async (tenantId: string, tuitionId: string): Promise<IFindTuitionDetail> => {
  try {
    let result = await TuitionsModel.findOne({ $and: [{ tenant: tenantId }, { _id: tuitionId }] })
      .populate({
        path: 'courseForTutor',
        model: 'CourseForTutor',
        populate: [{
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
        }]        
      })
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
      .populate('sessions')
      .populate('tutor')
      .populate('student')
      .exec() as any;

    let tuition = JSON.parse(JSON.stringify(result));
    if(tuition && tuition.course) {
      tuition.course.level = tuition.course.level ? tuition.course.level.name : undefined;
      tuition.course.grade = tuition.course.grade ? tuition.course.grade.name : undefined;
      tuition.course.subject = tuition.course.subject ? tuition.course.subject.name : undefined;
    }

    if (tuition && tuition.courseForTutor && tuition.courseForTutor.course) {
      tuition.courseForTutor.course.level = tuition.courseForTutor.course.level ? tuition.courseForTutor.course.level.name : undefined;
      tuition.courseForTutor.course.grade = tuition.courseForTutor.course.grade ? tuition.courseForTutor.course.grade.name : undefined;
      tuition.courseForTutor.course.subject = tuition.courseForTutor.course.subject ? tuition.courseForTutor.course.subject.name : undefined;
    }
    console.log('tuition', tuition);
    return tuition;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findById = async (tuitionId: string): Promise<IFindTuitionDetail> => {
  try {
    let result = await TuitionsModel.findOne({ _id: tuitionId })
      .populate('courseForTutor')
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
      .populate('sessions')
      .populate('tutor')
      .populate('student')
      .exec() as any;

    let tuition = JSON.parse(JSON.stringify(result));
    if(tuition && tuition.course) {
      tuition.course.level = tuition.course.level ? tuition.course.level.name : undefined;
      tuition.course.grade = tuition.course.grade ? tuition.course.grade.name : undefined;
      tuition.course.subject = tuition.course.subject ? tuition.course.subject.name : undefined;
    }
    return tuition;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createTuition = async (tenantId: string, body: ICreateTuitionInput): Promise<IFindTuitionDetail> => {
  try {
    const newTuition = new TuitionsModel({
      ...body,
      isCompleted: false,
      isCanceled: false,
      isPendingReview: false,
      isActive: true,
      cancelReason: '',
      tenant: tenantId,
    });
    var result = await newTuition.save();
    await courseForTutorRepository.addTuition(result.courseForTutor.toString(), tenantId, result._id);
    await synchronizeUsers({ $or: [{ _id: result.tutor }, { _id: result.student }] });
    return result;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateTuition = async (tenantId: string, body: IUpdateTuitionInput): Promise<void> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({ $and: [{ _id: body._id }, { tenant: tenantId }] }, { $set: body }, { new: true }).exec();
    if (result !== null) {
      await synchronizeUsers({ $or: [{ _id: result.tutor }, { _id: result.student }] });
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const finishTuition = async (tenantId: string, body: IFinishTuition): Promise<void> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({ $and: [{ _id: body.tuitionId }, { tenant: tenantId }] }, { $set: { ...body, isFinished: true } }, { new: true }).exec();
    if (result !== null) {
      await synchronizeUsers({ $or: [{ _id: result.tutor }, { _id: result.student }] });
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const cancelTuition = async (tenantId: string, body: ICancelTuition): Promise<IFindTuitionDetail> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({
      $and: [
        { _id: body.tuitionId },
        { tenant: tenantId }
      ]
    }, {
        $set: {
          ...body,
          isCanceled: true,
          // isPendingReview: true,
          cancelAt : Date.now()
        }
      }, { new: true })
      .populate('tutor')
      .populate({
        path: 'sessions',
        model: 'Session',
        populate: [{
          path: 'student',
          model: 'User',
          select: '_id fullName'
        }]
      })
      .populate('student')
      .populate('courseForTutor')
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
      .exec() as any;
    if (result !== null) {
      if (result.sessions && result.sessions.length) {
        await sessionRepository.cancelSessions(result.sessions);
      };
      await synchronizeUsers({$or : [{_id: result.tutor}, {_id: result.student}]});
    }
    let tuition = JSON.parse(JSON.stringify(result))
    if(tuition && tuition.course) {
      tuition.course.level = tuition.course.level ? tuition.course.level.name : undefined;
      tuition.course.grade = tuition.course.grade ? tuition.course.grade.name : undefined;
      tuition.course.subject = tuition.course.subject ? tuition.course.subject.name : undefined;
    }
    return tuition;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const cancelUnpaidTuition = async (_id: string) : Promise<any> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({_id: _id}, {
        $set: {
          isCanceled: true,
          // isPendingReview: true,
          cancelAt : Date.now()
        }
      }, { new: true })
      .populate('tutor')
      .populate({
        path: 'sessions',
        model: 'Session',
        populate: [{
          path: 'student',
          model: 'User',
          select: '_id fullName'
        }]
      })
      .populate('student')
      .populate('courseForTutor')
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
      .exec() as any;
    if (result !== null) {
      if (result.sessions && result.sessions.length) {
        await sessionRepository.cancelSessions(result.sessions);
      };
      await synchronizeUsers({$or : [{_id: result.tutor}, {_id: result.student}]});
    }
    let tuition = JSON.parse(JSON.stringify(result))
    if(tuition && tuition.course) {
      tuition.course.level = tuition.course.level ? tuition.course.level.name : undefined;
      tuition.course.grade = tuition.course.grade ? tuition.course.grade.name : undefined;
      tuition.course.subject = tuition.course.subject ? tuition.course.subject.name : undefined;
    }
    return tuition;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const putToPendingTuition = async (tenantId: string, body: ICancelTuition): Promise<IFindTuitionDetail> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({
      $and: [
        { _id: body.tuitionId },
        { tenant: tenantId }
      ]
    }, {
        $set: {
          ...body,
          // isCanceled: true,
          isPendingReview: true,
          cancelReason: body.cancelReason,
          cancelBy : body.userId,
        }
      }, { new: true })
      .populate('tutor')
      .populate({
        path: 'sessions',
        model: 'Session',
        populate: [{
          path: 'student',
          model: 'User',
          select: '_id fullName'
        }]
      })
      .populate('student')
      .populate('courseForTutor')
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
      .exec() as any;
    if (result !== null) {
      // if (result.sessions && result.sessions.length) {
      //   await sessionRepository.cancelSessions(result.sessions);
      // };
      await synchronizeUsers({$or : [{_id: result.tutor}, {_id: result.student}]});
    }
    let tuition = JSON.parse(JSON.stringify(result))
    if(tuition && tuition.course) {
      tuition.course.level = tuition.course.level ? tuition.course.level.name : undefined;
      tuition.course.grade = tuition.course.grade ? tuition.course.grade.name : undefined;
      tuition.course.subject = tuition.course.subject ? tuition.course.subject.name : undefined;
    }
    return tuition;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const addSession = async (_id: string, tenantId: string, sessionId: string): Promise<void> => {
  try {
    const result = await TuitionsModel.findOneAndUpdate({ _id, tenant: tenantId }, { $push: { sessions: sessionId } }, { new: true }).exec();
    if (result !== null) {
      await synchronizeUsers({ $or: [{ _id: result.tutor }, { _id: result.student }] });
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCompletedTuitions = async (completedList: string[]): Promise<void> => {
  try {
    await TuitionsModel.updateMany({ _id: { $in: completedList } }, { $set: { isCompleted: true } }, { new: true }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findNewestTuitionsBooking = async (tenantId: string, tutor: string): Promise<IGetTuitions> => {
  try {
    const resl = await TuitionsModel.find({ tenant: tenantId, tutor: tutor, isCompleted: false, isCanceled: false, isPendingReview: false })
      .sort('-createdAt')
      .limit(5)
      .populate('courseForTutor')
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
      .populate('student')
      .populate('sessions')
      .exec();
    
    let result = JSON.parse(JSON.stringify(resl));
    const dataReturned = result.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const groupTuition = await GroupTuitionModel.find({ tenant: tenantId, tutor: tutor, isActive: true})
      .sort('-createdAt')
      .limit(5)
      .populate('courseForTutor')
      .populate('tutor')
      .populate('period')
      .populate('sessions')
      .exec()
    return dataReturned.concat(groupTuition as any).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const countNewestTuition = async (tenant: string): Promise<number> => {
  // Last 30 days
  return await TuitionsModel.find({tenant: tenant, createdAt: { $gt : new Date(Date.now() - 30*24*60*60*1000)} }).countDocuments().exec();
}

const countNewestTransaction = async (tenant: string): Promise<number> => {
  // Last 30 days
  const individualTuitions = await countNewestTuition(tenant);
  const groupTuitions = await GroupTuitionModel.find({
    tenant: tenant,
    "course.startReg" : { $gt : new Date(Date.now() - 30*24*60*60*1000)}
  }).select('students').exec();

  const groupTuitionTransactions = groupTuitions.reduce((sum, val) => {
    return sum += val.students.length;
  }, 0);

  return individualTuitions + groupTuitionTransactions;
}

const findCanceledTuitions = async (tenant: string): Promise<any> => {
  // Last 30 days
  const indv = await TuitionsModel.find({tenant: tenant, cancelAt: { $gt : new Date(Date.now() - 30*24*60*60*1000)}, isCanceled: true })
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
  .populate('cancelBy').exec();
  let individualTuitions = JSON.parse(JSON.stringify(indv));
  const dataReturned = individualTuitions.map((val) => {
    let clone = JSON.parse(JSON.stringify(val));
    if (clone && clone.course) {
      clone.course = {
        ...clone.course,
        level: clone.course.level ? clone.course.level.name : undefined,
        grade: clone.course.grade ? clone.course.grade.name : undefined,
        subject: clone.course.subject ? clone.course.subject.name : undefined,
      }
    }
    return clone;
  })

  const groupTuitions = await GroupTuitionModel.find({
    tenant: tenant,
    cancelAt : { $gt : new Date(Date.now() - 30*24*60*60*1000)},
    isCanceled: true
  }).populate('tutor').populate('cancelBy').exec();
  return [...dataReturned, ...groupTuitions];
}

const findAllTuitions = async (tenant: string): Promise<any> => {
  let allTuitions = await TuitionsModel.find({tenant: tenant})
  .populate('courseForTutor')
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
  .populate('student')
  .populate('sessions')
  .exec();

  let deepClone = JSON.parse(JSON.stringify(allTuitions));
  const dataReturned = deepClone.map((val) => {
    let clone = JSON.parse(JSON.stringify(val));
    if (clone && clone.course) {
      clone.course = {
        ...clone.course,
        level: clone.course.level ? clone.course.level.name : undefined,
        grade: clone.course.grade ? clone.course.grade.name : undefined,
        subject: clone.course.subject ? clone.course.subject.name : undefined,
      }
    }
    return clone;
  })
  return dataReturned;
}

const findPartialTuitions = async (): Promise<any> => {
  return await TuitionsModel.find({option: 'partiallyPay'}).exec();
}

export {
  findByStudentId,
  findByTutorId,
  createTuition,
  updateTuition,
  finishTuition,
  cancelTuition,
  findByTuitionId,
  addSession,
  deleteOneTuition,
  findUncompletedTuitions,
  updateCompletedTuitions,
  findNewestTuitionsBooking,
  findCancelTuitionStudent,
  findCancelTuitionTutor,
  findTuitions,
  findAllTuitionsByStudentId,
  countNewestTuition,
  countNewestTransaction,
  findCanceledTuitions,
  findTuitionsByStudentIdInCalendar,
  findAllTuitions,
  putToPendingTuition,
  findPartialTuitions,
  cancelUnpaidTuition,
  findById,
  findRequestCancelByTutorId,
  findRequestCancelByStudentId
};
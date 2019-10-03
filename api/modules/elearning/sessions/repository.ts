import SessionsModel from './mongoose';
import { IFindSessionsQuery, IFindSessionsResult, ICreateSessionsInput, IUpdateSessionInput, IFindSessionDetail, IUploadMaterialInput, IUploadMaterialResult, IFindSessions, IFindStudentSessionQuery, ICreateMultipleGroupSession, IUploadReportIssueInput, IUploadRateSessionInput, IDeleteMaterialInput } from './interface';
import * as tuitionsRepository from '../tuitions/repository';
import config from '../../../config/modules/sessions.config';
import * as ratingRepository from '../ratings/repository';

const findByTuitionId = async (tenantId: string, query: IFindSessionsQuery): Promise<IFindSessionsResult> => {
  try {
    const totalPromise = SessionsModel.find({ $and: [{ tuition: query.tuitionId }, { tenant: tenantId }] })
      .countDocuments()
      .exec();

    const dataPromise = SessionsModel.find({ $and: [{ tuition: query.tuitionId }, { tenant: tenantId }] })
      .sort('start')
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
      .populate('courseForTutor')
      .populate('tuition')
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
      total,
      data: dataReturned,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteSessions = async (tenantId: string, sessionsId: Array<string>): Promise<void> => {
  try {
    await SessionsModel.deleteMany({ tenant: tenantId, _id: { $in: sessionsId } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTutorId = async (tenantId: string, tutorId: string): Promise<IFindSessions> => {
  try {
    const results = await SessionsModel.find({ tutor: tutorId, tenant: tenantId }).exec();
    return results;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findBySessionId = async (tenantId: string, sessionId: string): Promise<IFindSessionDetail> => {
  try {
    let result = await SessionsModel.findOne({ $and: [{ tenant: tenantId }, { _id: sessionId }] })
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
      .populate('courseForTutor')
      .populate('tuition')
      .populate('tutor')
      .populate('student')
      .populate('groupTuition')
      .populate('reportSession')
      .exec() as any;
    let session = JSON.parse(JSON.stringify(result));
    if (session && session.course) {
      session.course.level = session.course.level ? session.course.level.name : undefined;
      session.course.grade = session.course.grade ? session.course.grade.name : undefined;
      session.course.subject = session.course.subject ? session.course.subject.name : undefined;
    }
    return session;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createSessions = async (tenantId: string, body: ICreateSessionsInput): Promise<IFindSessionsResult> => {
  try {
    const newSessions = await SessionsModel.create(body.sessionList.map((item) => ({
      ...item,
      isCompleted: false,
      tenant: tenantId
    })));

    await newSessions.forEach(async (val) => {
      await tuitionsRepository.addSession(val.tuition.toString(), val.tenant.toString(), val._id);
    });

    return {
      data: newSessions,
      total: newSessions.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateSessions = async (_tenantId: string, body: any): Promise<any> => {
  try {
    // const newSessions = await SessionsModel.create(body.sessionList.map((item) => ({
    //   ...item,
    //   isCompleted: false,
    //   tenant: tenantId
    // })));

    const promises = body.sessionList.map((val) => {
      return SessionsModel.findOneAndUpdate({_id: val._id}, {$set : val}, {new: true}).exec();
    })
    const newSessions = await Promise.all(promises);

    return {
      data: newSessions,
      total: newSessions.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateSession = async (tenantId: string, body: IUpdateSessionInput): Promise<void> => {
  try {
    await SessionsModel.updateOne({ $and: [{ tenant: tenantId }, { _id: body._id }] }, { $set: body });
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateReportIssue = async (tenantId: string, sessionId: string, body: IUploadReportIssueInput): Promise<void> => {
  const resultReportSession = {
    reportStudent: body.reportInfo.reportStudent,
    reportTutor: body.reportInfo.reportTutor,
    reasonReport: body.reportInfo.reasonReport,
    commentReport: body.reportInfo.commentReport,
    uploadBy: body.reportInfo.uploadBy,
    uploadDate: new Date,
  }
  try {
    await SessionsModel.findOneAndUpdate({ $and: [{ tenant: tenantId }, { _id: sessionId }] }, { $push: { reportSession: resultReportSession } }, { new: true }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateRateSession = async (tenantId: string, sessionId: string, body: IUploadRateSessionInput): Promise<any> => {
  try {
    const session = await SessionsModel.findOne({_id: sessionId}).exec();
    if (session) {
      const newRating = await ratingRepository.create(tenantId, {...body.rateSession , tutor: session.tutor} as any);
      return await SessionsModel.findOneAndUpdate({ $and: [{ tenant: tenantId }, { _id: sessionId }] }, { $push: { rateSession: newRating._id } }, { new: true }).exec();
    } else {
      throw new Error('Cannot find session!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateSessionMaterials = async (tenantId: string, sessionId: string, body: IUploadMaterialInput): Promise<IUploadMaterialResult> => {
  try {
    const result = await SessionsModel.findOneAndUpdate({ $and: [{ tenant: tenantId }, { _id: sessionId }] }, { $push: { materials: { $each: body.materialsInfo.map((item) => ({ ...item, uploadDate: new Date() })) } } }, { new: true }).exec();
    return {
      newMaterialsInfo: (result as any).materials,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCompletedSessions = async (): Promise<void> => {
  try {
    await SessionsModel.updateMany({
      $and: [
        { end: { $lte: new Date() } },
        { isCompleted: false }
      ]
    }, { $set: { isCompleted: true } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findById = async (_id: string): Promise<IFindSessionDetail> => {
  try {
    return await SessionsModel.findOne({ _id }).exec() as any;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findAllEndedSession = async (): Promise<any> => {
  try {
    var lte = new Date(Date.now() + config.maximumDelayEndTime);
    return await SessionsModel.find({ end: { $lte: lte.toISOString() }, isCompleted: false });
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findOvertimeRecordingSessions = async (): Promise<any> => {
  try {
    var lte = new Date(Date.now() - config.maximumRecordingTime);
    return await SessionsModel.find({ end: { $lte: lte }, isCompleted: true });
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
}

const findUpcomingTuitions = async (tenantId: string, tutor: string): Promise<any> => {
  try {
    var dayTemp = new Date();
    var lastDayOfTheWeek = new Date(dayTemp.setDate(dayTemp.getDate() - dayTemp.getDay() + 7));
    let results = await SessionsModel.find({ tenant: tenantId, tutor: tutor, isCompleted: false, end: { $gt: new Date().toISOString(), $lt: lastDayOfTheWeek.toISOString() } })
      .sort('end')
      .populate([{
        path: 'tuition',
        model: 'Tuition',
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
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }, {
          path: 'tutor',
          model: 'User'
        }, {
          path: 'student',
          model: 'User'
        }]
      }, {
        path: 'groupTuition',
        model: 'GroupTuition',
        populate: [{
          path: 'tutor',
          model: 'User'
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }]
      }])
      .exec();

    let sessions = JSON.parse(JSON.stringify(results));
    sessions = sessions.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.tuition && clone.tuition.course) {
        clone.tuition.course = {
          ...clone.tuition.course,
          level: clone.tuition.course.level ? clone.tuition.course.level.name : undefined,
          grade: clone.tuition.course.grade ? clone.tuition.course.grade.name : undefined,
          subject: clone.tuition.course.subject ? clone.tuition.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const individualTuition = sessions.map((val) => {
      return val.tuition ? val.tuition : null;
    }).filter(val => !!val && !val.isCompleted && !val.isCanceled && !val.isPendingReview).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc) {
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.upcomingSessions = sessions.filter((ses) => {
          return ses.tuition && ses.tuition._id.toString() === newObj._id.toString();
        }).map((session) => {
          if (session) {
            return {
              _id: session._id,
              start: session.start,
              end: session.end
            };
          } else {
            return null
          }
        }).filter(val => !!val);
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    const groupTuition = sessions.map((val) => {
      return val.groupTuition ? val.groupTuition : null;
    }).filter(val => !!val && val.isActive).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc){
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.upcomingSessions = sessions.filter((ses) => {
          return ses.groupTuition && ses.groupTuition._id.toString() === newObj._id.toString();
        }).map((session) => {
          return {
            _id: session._id,
            start: session.start,
            end: session.end
          };
        });
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    return individualTuition.concat(groupTuition);
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findUpcomingTuitionsOfTenant = async (tenantId: string): Promise<any> => {
  try {
    var dayTemp = new Date();
    var lastDayOfTheWeek = new Date(dayTemp.setDate(dayTemp.getDate() - dayTemp.getDay() + 7));
    let results = await SessionsModel.find({ tenant: tenantId, isCompleted: false, end: { $gt: new Date().toISOString(), $lt: lastDayOfTheWeek.toISOString() } })
      .sort('end')
      .populate([{
        path: 'tuition',
        model: 'Tuition',
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
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }, {
          path: 'tutor',
          model: 'User'
        }, {
          path: 'student',
          model: 'User'
        }]
      }, {
        path: 'groupTuition',
        model: 'GroupTuition',
        populate: [{
          path: 'tutor',
          model: 'User'
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }]
      }])
      .exec();

    let sessions = JSON.parse(JSON.stringify(results));
    sessions = sessions.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.tuition && clone.tuition.course) {
        clone.tuition.course = {
          ...clone.tuition.course,
          level: clone.tuition.course.level ? clone.tuition.course.level.name : undefined,
          grade: clone.tuition.course.grade ? clone.tuition.course.grade.name : undefined,
          subject: clone.tuition.course.subject ? clone.tuition.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const individualTuition = sessions.map((val) => {
      return val.tuition ? val.tuition : null;
    }).filter(val => !!val && !val.isCompleted && !val.isCanceled && !val.isPendingReview).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc) {
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.upcomingSessions = sessions.filter((ses) => {
          return ses.tuition && ses.tuition._id.toString() === newObj._id.toString();
        }).map((session) => {
          if (session) {
            return {
              _id: session._id,
              start: session.start,
              end: session.end
            };
          } else {
            return null
          }
        }).filter(val => !!val);
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    const groupTuition = sessions.map((val) => {
      return val.groupTuition ? val.groupTuition : null;
    }).filter(val => !!val && val.isActive).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc){
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.upcomingSessions = sessions.filter((ses) => {
          return newObj.sessions.map(v => v.toString()).indexOf(ses._id.toString()) >= 0;
        }).map((session) => {
          return {
            _id: session._id,
            start: session.start,
            end: session.end
          };
        });
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    return individualTuition.concat(groupTuition);
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const checkStudentSchedule = async (tenantId: string, query: IFindStudentSessionQuery): Promise<any> => {
  try {
    const existedSchedules = await SessionsModel.findOne({
      $and: [
        { tenant: tenantId },
        { student: query.studentId },
        {
          $or: [
            { start: { $gte: query.period.start, $lte: query.period.end } },
            { end: { $gte: query.period.start, $lte: query.period.end } }
          ]
        },
        { isCompleted : false}
      ]
    }).populate({
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
    }).populate('tutor').exec();

    if (existedSchedules) {
      let session = JSON.parse(JSON.stringify(existedSchedules));
      if (session.course) {
        session.course.level = session.course.level ? session.course.level.name : undefined;
        session.course.grade = session.course.grade ? session.course.grade.name : undefined;
        session.course.subject = session.course.subject ? session.course.subject.name : undefined;
      }
      return session;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const checkStudentScheduleVer2 = async (tenantId: string, query: IFindStudentSessionQuery): Promise<any> => {
  try {
    const existedSchedules = await SessionsModel.findOne({
      $and: [
        { tenant: tenantId },
        { student: query.studentId },
        {
          $or: [
            { start: { $gte: query.period.start, $lte: query.period.end } },
            { end: { $gte: query.period.start, $lte: query.period.end } }
          ]
        },
        { isCompleted : false}
      ]
    }).populate({
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
    }).populate('tutor').populate([{
      path: 'tuition',
      model: 'Tuition',
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
    }]).exec();

    if (existedSchedules) {
      let session = JSON.parse(JSON.stringify(existedSchedules));
      if (session.course) {
        session.course.level = session.course.level ? session.course.level.name : undefined;
        session.course.grade = session.course.grade ? session.course.grade.name : undefined;
        session.course.subject = session.course.subject ? session.course.subject.name : undefined;
      }
      if (session.tuition && session.tuition.course) {
        session.tuition.course.level = session.tuition.course.level ? session.tuition.course.level.name : undefined;
        session.tuition.course.grade = session.tuition.course.grade ? session.tuition.course.grade.name : undefined;
        session.tuition.course.subject = session.tuition.course.subject ? session.tuition.course.subject.name : undefined;
      }
      return session;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const createMultipleGroupSessions = async (tenantId: string, query: ICreateMultipleGroupSession): Promise<any> => {
  try {
    const promises = query.period.map(val => {
      const createdObj = new SessionsModel({
        groupTuition: query.groupTuition,
        tutor: query.tutor,
        start: val.start,
        end: val.end,
        isCompleted: false,
        tenant: tenantId
      });
      return createdObj.save();
    })
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const cancelSessions = async (sessionsList: string[]): Promise<any> => {
  try {
    const promises = sessionsList.map(val => {
      return SessionsModel.findOneAndUpdate({ _id: val }, { isCompleted: true }, { new: true }).exec();
    })
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const getTutorRatings = async (tutorId: string): Promise<any> => {
  try {
    const results = await SessionsModel.find({ tutor: tutorId}).populate('rateSession').select('rateSession').exec();
    return results;
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const deleteMaterial = async (tenantId: string, body: IDeleteMaterialInput): Promise<void> => {
  try {
    await SessionsModel.findOneAndUpdate({$and: [{tenant: tenantId, _id: body.sessionId}]}, {$pull: {materials: {_id: body.materialId}}}).exec();
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findReportIssueTuitions = async (tenantId: string): Promise<any> => {
  try {
    let results = await SessionsModel.find({ tenant: tenantId, "reportSession.uploadDate" : { $gt : new Date(Date.now() - 30*24*60*60*1000)} })
      .sort('end')
      .populate([{
        path: 'tuition',
        model: 'Tuition',
        populate: [{
          path: 'course',
          model: 'Course',
          populate: [{
            path: 'level',
            model: 'Level'
          }, {
            path: 'subject',
            model: 'Subject'
          }, {
            path: 'grade',
            model: 'Grade'
          }]
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }, {
          path: 'tutor',
          model: 'User'
        }, {
          path: 'student',
          model: 'User'
        }]
      }, {
        path: 'groupTuition',
        model: 'GroupTuition',
        populate: [{
          path: 'tutor',
          model: 'User'
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }]
      }])
      .populate('reportSession.uploadBy')
      .exec();

    let sessions = JSON.parse(JSON.stringify(results));
    sessions = sessions.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.tuition && clone.tuition.course) {
        clone.tuition.course = {
          ...clone.tuition.course,
          level: clone.tuition.course.level ? clone.tuition.course.level.name : undefined,
          grade: clone.tuition.course.grade ? clone.tuition.course.grade.name : undefined,
          subject: clone.tuition.course.subject ? clone.tuition.course.subject.name : undefined,
        }
      }
      return clone;
    })

    const individualTuition = sessions.map((val) => {
      return val.tuition ? val.tuition : null;
    }).filter(val => !!val).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc) {
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.reportedSession = sessions.filter((ses) => {
          return ses.tuition && ses.tuition._id.toString() === newObj._id.toString();
        }).map((session: any) => {
          if (session && session.reportSession && session.reportSession.length) {
            return {
              _id: session._id,
              data: session.reportSession[session.reportSession.length - 1]
            };
          } else {
            return null
          }
        }).filter(val => !!val);
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    const groupTuition = sessions.map((val) => {
      return val.groupTuition ? val.groupTuition : null;
    }).filter(val => !!val).reduce((arr: any, value: any) => {
      if (arr.length) {
        arr = arr.filter((ind: any) => {
          return ind && ind._id && ind._id !== value._id;
        });
        arr.push(value);
        return arr;
      } else {
        arr.push(value);
        return arr;
      }
    }, []).map((doc) => {
      if (doc){
        var newObj = JSON.parse(JSON.stringify(doc));
        newObj.reportedSession = sessions.filter((ses) => {
          return ses.groupTuition && ses.groupTuition._id.toString() === newObj._id.toString();
        }).map((session: any) => {
          if (session && session.reportSession && session.reportSession.length) {
            return {
              _id: session._id,
              data: session.reportSession[session.reportSession.length - 1]
            };
          } else {
            return null
          }
        }).filter(v => !!v);
        return newObj;
      } else {
        return null;
      }
    }).filter(val => !!val);

    return individualTuition.concat(groupTuition);
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
};

const findOverdueUnpaidSession = async (): Promise<any> => {
  var lte = new Date(Date.now() + config.maximumPaymentTime);
  return await SessionsModel.find({isPaid: false, start: {$lte: lte.toISOString()}, isCompleted: false })
}

const findNearDateSession = async (): Promise<any> => {
  var lte = new Date(Date.now() + config.maximumNotifyPaymentTime);
  return await SessionsModel.find({isPaid: false, start: {$lte: lte.toISOString()}, isCompleted: false, isPaymentNotified: false })
}

const updateSessionToCompleted = async(_id: string) : Promise<any> => {
  return await SessionsModel.findOneAndUpdate({_id: _id}, {$set: {isCompleted: true}}, {new: true}).exec();
}

const updateSessionToNotified = async(_id: string) : Promise<any> => {
  return await SessionsModel.findOneAndUpdate({_id: _id}, {$set: {isPaymentNotified: true}}, {new: true}).exec();
}

export {
  findByTuitionId,
  createSessions,
  updateSession,
  findBySessionId,
  updateSessionMaterials,
  findByTutorId,
  deleteSessions,
  findById,
  findAllEndedSession,
  updateCompletedSessions,
  findUpcomingTuitions,
  findUpcomingTuitionsOfTenant,
  checkStudentSchedule,
  createMultipleGroupSessions,
  updateReportIssue,
  cancelSessions,
  updateRateSession,
  getTutorRatings,
  deleteMaterial,
  findReportIssueTuitions,
  findOvertimeRecordingSessions,
  checkStudentScheduleVer2,
  findOverdueUnpaidSession,
  findNearDateSession,
  updateSessionToCompleted,
  updateSessionToNotified,
  updateSessions
};

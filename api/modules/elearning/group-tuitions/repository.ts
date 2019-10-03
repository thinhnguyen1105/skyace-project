import GroupTuitionModel from './mongoose';
// import * as mongoose from 'mongoose';
import * as courseForTutorRepository from '../course-for-tutor/repository';
import * as scheduleRepository from '../schedules/repository';
import * as sessionRepository from '../sessions/repository';
import { IFindGroupTuitionDetail, ICreateGroupTuitionInput, IUpdateGroupTuitionInput, IDeleteGroupTuitionInput, IBookingGroupTuitionInput, ICancelTuition, ICheckStudentSchedule } from './interface';
import UsersModel from '../../auth/users/mongoose';
import { synchronizeUsers } from '../../../elasticsearch/service';

const findUncompletedTuitions = async (): Promise<any> => {
  try {
    const results = await GroupTuitionModel.find({ isCompleted: false }).populate('sessions').populate('period').exec();
    return results;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTutorId = async (tenantId: string, _id: string, isCompleted?: boolean, isCanceled?: boolean): Promise<any> => {
  try {
    const queryActive = isCompleted !== undefined && isCanceled !== undefined ? {
      isCompleted,
      isCanceled
    } : isCompleted !== undefined ? {
      isCompleted
    } : isCanceled !== undefined ? {
      isCanceled
    } : {};
    const criteria = {
      ...{
        tutor: _id,
        tenant: tenantId,
      },
      ...queryActive
    };
    const tuitions = await GroupTuitionModel.find(criteria)
      .sort({ updatedAt: -1, createdAt: -1 })
      .populate('courseForTutor')
      .populate('tutor')
      .populate('students')
      .populate('period')
      .populate('sessions')
      .exec();
    return tuitions;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByStudentId = async (tenantId: string, _id: string, isCompleted?: boolean, isCanceled?: boolean): Promise<any> => {
  try {
    const queryActive = isCompleted !== undefined && isCanceled !== undefined ? {
      isCompleted,
      isCanceled
    } : isCompleted !== undefined ? {
      isCompleted
    } : isCanceled !== undefined ? {
      isCanceled
    } : {};
    const criteria = {
      ...{
        students: _id,
        tenant: tenantId
      },
      ...queryActive
    };

    const tuitions = await GroupTuitionModel.find(criteria)
      .sort({ updatedAt: -1, createdAt: -1 })
      .populate('courseForTutor')
      .populate('tutor')
      .populate('students')
      .populate('period')
      .populate('sessions')
      .exec();

    return tuitions;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findByTuitionId = async (tenantId: string, tuitionId: string): Promise<IFindGroupTuitionDetail> => {
  try {
    return await GroupTuitionModel.findOne({ $and: [{ tenant: tenantId }, { _id: tuitionId }] }).populate('courseForTutor').populate('period').populate('tutor').populate('sessions').populate('students').exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createTuition = async (tenantId: string, body: ICreateGroupTuitionInput): Promise<IFindGroupTuitionDetail> => {
  try {
    // First create schedules for all the period tutor has selected
    const promiseArray = body.period.map((val) => {
      return scheduleRepository.createNewSchedule(
        tenantId,
        {
          start: val.start,
          end: val.end,
          type: "tutor",
          isGroup: true,
          owner: body.tutor
        } as any)
    })

    const schedules = await Promise.all(promiseArray);

    // Create new group tuition
    const newTuition = new GroupTuitionModel({
      ...body,
      period: schedules.map(val => val._id),
      isCompleted: false,
      isCanceled: false,
      isActive: true,
      cancelReason: '',
      tenant: tenantId,
    });
    var result = await newTuition.save();

    // create courseForTutor as GroupTuition, with field isGroup set to true
    var courseForTutor = await courseForTutorRepository.createGroupCourse({
      tutor: body.tutor,
      groupTuition: result._id,
      hourlyRate: body.course.hourlyRate,
      tenant_id: tenantId,
      isGroup: true
    })

    // Then update its _id to group tuition created above
    var newResult = await GroupTuitionModel.findOneAndUpdate({ _id: result._id }, { courseForTutor: courseForTutor._id }, { new: true }).populate('tutor').populate('period').exec();
    if (newResult) {
      // Create a fake user for elasticsearch
      var clonedResult = JSON.parse(JSON.stringify(newResult));
      delete clonedResult.tutor._id;
      delete clonedResult.tutor.password;
      clonedResult.tutor.email = clonedResult.tutor.email + '-grouptuition-' + (clonedResult.tutor.groupTuitionFakeUsers ? clonedResult.tutor.groupTuitionFakeUsers.length : 0);
      clonedResult.tutor.courseForTutor = [courseForTutor._id];
      clonedResult.tutor.forGroupTuitionElastic = true;
      delete clonedResult.tutor.groupTuitionFakeUsers;
      const elasticUser = new UsersModel(clonedResult.tutor);
      await elasticUser.save();
      // Update fake user's _id to real user 'groupTuitionFakeUsers' field
      await UsersModel.updateOne({ _id: newResult.tutor._id }, { $push: { groupTuitionFakeUsers: elasticUser._id } });
      return newResult;
    }
    else return result;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateTuition = async (tenantId: string, body: IUpdateGroupTuitionInput): Promise<any> => {
  try {
    const currentGroupTuition = await GroupTuitionModel.findOne({ _id: body._id, tenant: tenantId }).exec();
    if (currentGroupTuition) {
      if (body.period && body.period.length) {
        await scheduleRepository.deleteSchedules(tenantId, currentGroupTuition.period.map(val => val._id));
        const promiseArray = body.period.map((val) => {
          return scheduleRepository.createNewSchedule(
            tenantId,
            {
              start: val.start,
              end: val.end,
              type: "tutor",
              isGroup: true,
              owner: currentGroupTuition.tutor
            } as any)
        })

        const schedules = await Promise.all(promiseArray);
        const updateData = {
          ...body,
          course: {
            ...currentGroupTuition.course,
            ...body.course
          },
          period: schedules.map(val => val._id)
        };
        const result = await GroupTuitionModel.findOneAndUpdate({ $and: [{ _id: body._id }, { tenant: tenantId }] }, { $set: updateData }, { new: true }).populate('courseForTutor').populate('period').exec();
        if (result) await synchronizeUsers({ courseForTutor: result.courseForTutor._id });
        return result;
      } else {
        const updateData = {
          ...body,
          course: {
            ...currentGroupTuition.course,
            ...body.course
          }
        };
        const result = await GroupTuitionModel.findOneAndUpdate({ $and: [{ _id: body._id }, { tenant: tenantId }] }, { $set: updateData }, { new: true }).populate('courseForTutor').populate('period').exec();
        if (result) await synchronizeUsers({ courseForTutor: result.courseForTutor });
        return result;
      }
    } else {
      throw new Error("Cannot find tuition!");
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteTuition = async (tenantId: string, body: IDeleteGroupTuitionInput): Promise<void> => {
  try {
    const currentGroupTuition = await GroupTuitionModel.findOne({ _id: body._id, tenant: tenantId }).exec();
    if (currentGroupTuition) {
      await GroupTuitionModel.deleteOne({ _id: body._id });
      await sessionRepository.deleteSessions(tenantId, currentGroupTuition.sessions as any);
      await scheduleRepository.deleteSchedules(tenantId, currentGroupTuition.period.map(val => val._id));
      var users = await UsersModel.find({ courseForTutor: currentGroupTuition.courseForTutor });
      var promises = users.map(doc => {
        return Promise.all([UsersModel.updateOne({ _id: currentGroupTuition.tutor }, { $pull: { groupTuitionFakeUsers: doc._id } }), doc.remove()]);
      })
      await Promise.all(promises);
    } else {
      throw new Error('Cannot find tuition!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const bookingTuition = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  try {
    const currentGroupTuition = await GroupTuitionModel.findOne({ _id: body.tuition_id, tenant: tenantId }).populate('period').exec();
    if (currentGroupTuition) {
      // Validate booking info
      if (currentGroupTuition.students.length + currentGroupTuition.slotsHolded.filter(val => val && (val.student.toString() !== body.student_id.toString())).length === currentGroupTuition.course.maxClassSize) {
        throw new Error('This group tuition is full!');
      } else {
        if (Date.now() < new Date(currentGroupTuition.course.startReg).getTime()) {
          throw new Error('Not the time for registration!');
        } else {
          if (Date.now() > new Date(currentGroupTuition.course.endReg).getTime()) {
            throw new Error('The time for registration has over!');
          } else {
            if (currentGroupTuition.students.indexOf(body.student_id as any) >= 0) {
              throw new Error('You have already booked this tuition.');
            } else {
              const promises = currentGroupTuition.period.map((val) => {
                return sessionRepository.checkStudentSchedule(tenantId, { studentId: body.student_id, period: val });
              })
              const checkedResults = await Promise.all(promises);
              const filteredResults = checkedResults.map((val, index) => {
                return {
                  index: index,
                  session: val
                }
              }).filter(val => {
                return !!val.session;
              });
              if (filteredResults.length) {
                return {
                  code: 'ERROR',
                  message: "Unsuitable time slot.",
                  data: filteredResults
                }
              } else {
                // Check with other group tuitions period
                const groupPromises = currentGroupTuition.period.map((val) => {
                  return checkStudentSchedule(tenantId, { tuition_id: currentGroupTuition._id, student_id: body.student_id, period: val, tutor: currentGroupTuition.tutor as any });
                })

                const checkedGroupResults = await Promise.all(groupPromises);
                const filteredGroupResults = checkedGroupResults.map((val, index) => {
                  return {
                    index: index,
                    tuition: val
                  }
                }).filter(val => {
                  return !!val.tuition;
                });
                if (filteredGroupResults.length) {
                  return {
                    code: 'ERROR_GROUP',
                    message: "Unsuitable time slot.",
                    data: filteredGroupResults
                  }
                } else {
                  // Create sessions if enough student
                  if (currentGroupTuition.students.length >= currentGroupTuition.course.minClassSize - 1) {
                    const results = await sessionRepository.createMultipleGroupSessions(tenantId, {
                      tutor: currentGroupTuition.tutor as any,
                      groupTuition: currentGroupTuition._id,
                      period: currentGroupTuition.period
                    })

                    const updatedTuition = await GroupTuitionModel.findOneAndUpdate({ _id: currentGroupTuition._id }, { $push: { students: body.student_id }, sessions: results.map(val => val._id), $pull: {slotsHolded: {student : body.student_id}} }, { new: true });

                    return {
                      code: 'SUCCESS',
                      message: "Booking successfully!",
                      data: updatedTuition
                    }
                  } else {
                    const updatedTuition = await GroupTuitionModel.findOneAndUpdate({ _id: currentGroupTuition._id }, { $push: { students: body.student_id } , $pull: {slotsHolded: {student : body.student_id}}}, { new: true });

                    return {
                      code: 'SUCCESS',
                      message: "Booking successfully!",
                      data: updatedTuition
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      throw new Error('Cannot find tuition!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const checkBookingCondition = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  try {
    const currentGroupTuition = await GroupTuitionModel.findOne({ _id: body.tuition_id, tenant: tenantId }).populate('period').exec();
    if (currentGroupTuition) {
      // Validate booking info
      if (currentGroupTuition.students.length + currentGroupTuition.slotsHolded.filter(val => val && (val.student.toString() !== body.student_id.toString())).length === currentGroupTuition.course.maxClassSize) {
        throw new Error('This group tuition is full!');
      } else {
        if (Date.now() < new Date(currentGroupTuition.course.startReg).getTime()) {
          throw new Error('Not the time for registration!');
        } else {
          if (Date.now() > new Date(currentGroupTuition.course.endReg).getTime()) {
            throw new Error('The time for registration has over!');
          } else {
            if (currentGroupTuition.students.indexOf(body.student_id as any) >= 0) {
              throw new Error('You have already booked this tuition.');
            } else {
              const promises = currentGroupTuition.period.map((val) => {
                return sessionRepository.checkStudentScheduleVer2(tenantId, { studentId: body.student_id, period: val });
              })
              const checkedResults = await Promise.all(promises);
              const filteredResults = checkedResults.map((val, index) => {
                return {
                  index: index,
                  session: val
                }
              }).filter(val => {
                return !!val.session;
              });
              if (filteredResults.length) {
                return {
                  code: 'ERROR',
                  message: "Unsuitable time slot.",
                  data: filteredResults
                }
              } else {
                // Check with other group tuitions period
                const groupPromises = currentGroupTuition.period.map((val) => {
                  return checkStudentSchedule(tenantId, { tuition_id: currentGroupTuition._id, student_id: body.student_id, period: val, tutor: currentGroupTuition.tutor as any });
                })

                const checkedGroupResults = await Promise.all(groupPromises);
                const filteredGroupResults = checkedGroupResults.map((val, index) => {
                  return {
                    index: index,
                    tuition: val
                  }
                }).filter(val => {
                  return !!val.tuition;
                });
                if (filteredGroupResults.length) {
                  return {
                    code: 'ERROR_GROUP',
                    message: "Unsuitable time slot.",
                    data: filteredGroupResults
                  }
                } else {
                  // Create sessions if enough student
                  if (currentGroupTuition.students.length >= currentGroupTuition.course.minClassSize) {
                    return {
                      code: 'SUCCESS'
                    }
                  } else {
                    return {
                      code: 'SUCCESS',
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      throw new Error('Cannot find tuition!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const cancelTuition = async (tenantId: string, body: ICancelTuition): Promise<IFindGroupTuitionDetail> => {
  try {
    if (body.cancelBy === 'tutor') {
      const result = await GroupTuitionModel.findOneAndUpdate({
        _id: body.tuitionId ,tenant: tenantId 
      }, {
        $set: {
          isCanceled: true,
          isActive: false,
          cancelReason: body.cancelReason,
          cancelBy: body.userId,
          cancelAt: Date.now()
        }
        }, { new: true })
        .populate('tutor')
        .populate('students')
        .populate('courseForTutor')
        .exec() as any;
      if (result) {
        if (result.sessions && result.sessions.length) {
          await sessionRepository.cancelSessions(result.sessions);
        };
        await synchronizeUsers({ $or: [{ _id: result.tutor._id }, { _id: {$in : result.students} }] });
        await synchronizeUsers({ courseForTutor: result.courseForTutor._id });
      }
      return result;
    } else {
      const result = await GroupTuitionModel.findOneAndUpdate({
        $and: [
          { _id: body.tuitionId },
          { tenant: tenantId }
        ]
      }, {
        $pull: {
          students: body.userId,
          slotsHolded: {student : body.userId}
        }
        }, { new: true })
        .populate('tutor')
        .populate('students')
        .populate('courseForTutor')
        .exec() as any;
      if (result !== null) {
        if (result.sessions && result.sessions.length) {
          await sessionRepository.cancelSessions(result.sessions);
        };
        await synchronizeUsers({ $or: [{ _id: result.tutor._id }, { _id: {$in : result.students} }] });
        await synchronizeUsers({ courseForTutor: result.courseForTutor._id });
      }
      return result;
    }

  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCompletedTuitions = async (completedList: string[], completedCourses: string[]): Promise<void> => {
  try {
    await GroupTuitionModel.updateMany({ _id: { $in: completedList } }, { $set: { isCompleted: true, isActive: false } }).exec();
    const promises = completedCourses.map((val) => {
      return synchronizeUsers({ courseForTutor: val })
    })
    await Promise.all(promises);
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const holdSlot = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<any> => {
  try {
    const currentGroupTuition = await GroupTuitionModel.findOne({ _id: body.tuition_id, tenant: tenantId }).populate('period').exec();
    if (currentGroupTuition) {
      // Validate booking info
      if (currentGroupTuition.slotsHolded.filter(val => val && (val.student.toString() === body.student_id.toString())).length) {
        return {
          code: 'ERROR',
          message: 'You have already holded this tuition.'
        }
      }
      else {
        if (currentGroupTuition.students.length + currentGroupTuition.slotsHolded.length === currentGroupTuition.course.maxClassSize) {
          throw new Error('This group tuition is full!');
        } else {
          if (Date.now() < new Date(currentGroupTuition.course.startReg).getTime()) {
            throw new Error('Not the time for registration!');
          } else {
            if (Date.now() > new Date(currentGroupTuition.course.endReg).getTime()) {
              throw new Error('The time for registration has over!');
            } else {
              if (currentGroupTuition.students.indexOf(body.student_id as any) >= 0) {
                throw new Error('You have already booked this tuition.');
              } else {
                const promises = currentGroupTuition.period.map((val) => {
                  return sessionRepository.checkStudentSchedule(tenantId, { studentId: body.student_id, period: val });
                })
                const checkedResults = await Promise.all(promises);
                const filteredResults = checkedResults.map((val, index) => {
                  return {
                    index: index,
                    session: val
                  }
                }).filter(val => {
                  return !!val.session;
                });
                if (filteredResults.length) {
                  return {
                    code: 'ERROR',
                    message: "Unsuitable time slot.",
                    data: filteredResults
                  }
                } else {
                  // Check with other group tuitions period
                  const groupPromises = currentGroupTuition.period.map((val) => {
                    return checkStudentSchedule(tenantId, { tuition_id: currentGroupTuition._id, student_id: body.student_id, period: val, tutor: currentGroupTuition.tutor as any });
                  })

                  const checkedGroupResults = await Promise.all(groupPromises);
                  const filteredGroupResults = checkedGroupResults.map((val, index) => {
                    return {
                      index: index,
                      tuition: val
                    }
                  }).filter(val => {
                    return !!val.tuition;
                  });
                  if (filteredGroupResults.length) {
                    return {
                      code: 'ERROR_GROUP',
                      message: "Unsuitable time slot.",
                      data: filteredGroupResults
                    }
                  } else {
                    const updatedTuition = await GroupTuitionModel.findOneAndUpdate({ _id: currentGroupTuition._id }, { $push: { slotsHolded: { student: body.student_id, startTime: Number(Date.now()) } }}, { new: true });
    
                    return {
                      code: 'SUCCESS',
                      message: "Slot holded successfully!",
                      data: updatedTuition
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      throw new Error('Cannot find tuition!');
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const cancelSlot = async (tenantId: string, body: IBookingGroupTuitionInput): Promise<void> => {
  try {
    await GroupTuitionModel.findOneAndUpdate({tenant: tenantId, _id: body.tuition_id}, {$pull : {slotsHolded : {student: body.student_id}}}, { new: true}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const getAllTimeoutSlots = async (): Promise<any> => {
  try {
    const maxDate = Number(Date.now() - 10 * 60 * 1000);
    return await GroupTuitionModel.find({"slotsHolded.startTime" : {$lte : maxDate}}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const checkStudentSchedule = async(tenant: string , query: ICheckStudentSchedule): Promise<any> => {
  try {
    const existedSchedules = await scheduleRepository.findGroupSchedules(tenant, {
      tutor: query.tutor,
      period: query.period
    });
    if (existedSchedules) {
      const existedTuitions = await GroupTuitionModel.findOne({
        tenant: tenant,
        students: query.student_id,
        _id: {$ne : query.tuition_id},
        period : existedSchedules._id,
        isActive : true
      }).populate('tutor').exec();
      if (existedTuitions) {
        return existedTuitions;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

export {
  findByStudentId,
  findByTutorId,
  updateTuition,
  checkBookingCondition,
  findByTuitionId,
  deleteTuition,
  findUncompletedTuitions,
  createTuition,
  bookingTuition,
  updateCompletedTuitions,
  cancelTuition,
  holdSlot,
  cancelSlot,
  getAllTimeoutSlots,
  checkStudentSchedule
};
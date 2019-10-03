import SchedulesModel from './mongoose';
import { IFindSchedulesQuery, IFindSchedulesResult, ICreateScheduleInput, IFindScheduleDetail, IUpdateScheduleInput, ICreateMultipleSchedulesInput, IRescheduleInput, IFindGroupSchedule, IFindScheduleByUserIdQuery, IFindTrialScheduleByUserIdQuery } from './interface';

const findByUserId = async (tenantId: string, query: IFindScheduleByUserIdQuery): Promise<IFindSchedulesResult> => {
  try {
    const schedules = await SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { start: { $gte: query.start } },
        { end: { $lte: query.end } },
        { owner: query.userId }
      ]
    });

    return {
      total: schedules.length,
      data: schedules
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const trialScheduleByUserId = async (tenantId: string, query: IFindTrialScheduleByUserIdQuery): Promise<IFindSchedulesResult> => {
  try {
    const schedules = await SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { student: query.userId },
        { type: 'trial' },
      ]
    });

    return {
      total: schedules.length,
      data: schedules
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findSchedules = async (tenantId: string, query: IFindSchedulesQuery): Promise<IFindSchedulesResult> => {
  try {
    const schedules = await SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { start: { $gte: query.start } },
        { end: { $lte: query.end } },
        { $or: [{ owner: query.tutorId }, { parent: query.tutorId }] }
      ]
    });

    return {
      total: schedules.length,
      data: schedules
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createNewSchedule = async (tenantId: string, body: ICreateScheduleInput): Promise<IFindScheduleDetail> => {
  try {
    const newSchedule = new SchedulesModel({
      ...body,
      tenant: tenantId,
      isCompleted: false,
    });
    return await newSchedule.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteSchedules = async (tenantId: string, schedulesId: Array<string>): Promise<void> => {
  try {
    await SchedulesModel.deleteMany({ tenant: tenantId, _id: { $in: schedulesId } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateSchedule = async (tenantId: string, body: IUpdateScheduleInput): Promise<void> => {
  try {
    await SchedulesModel.updateOne({ $and: [{ _id: body._id }, { tenant: tenantId }] }, { $set: body }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findSchedulesForCheckBookings = async (tenantId: string, query: IFindSchedulesQuery): Promise<IFindSchedulesResult> => {
  try {
    // Exec query
    const totalPromise = SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { start: { $gte: query.start } },
        { end: { $lte: query.end } },
        { $or: [{ owner: query.tutorId }, { parent: query.tutorId }] }
      ]
    })
      .countDocuments()
      .exec();

    const dataPromise = SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { start: { $gte: query.start } },
        { end: { $lte: query.end } },
        { $or: [{ owner: query.tutorId }, { parent: query.tutorId }] }
      ]
    })
      .select('_id start end title type owner parent tenant isGroup')
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);

    return {
      total,
      data
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createMultipleSchedules = async (tenantId: string, body: ICreateMultipleSchedulesInput): Promise<IFindSchedulesResult> => {
  try {
    const newSchedules = await SchedulesModel.create(body.schedulesList.map((item) => ({ ...item, tenant: tenantId })));
    return {
      data: newSchedules,
      total: newSchedules.length,
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findScheduleById = async (tenantId: string, scheduleId: string): Promise<IFindScheduleDetail> => {
  try {
    const schedule = await SchedulesModel.findOne({ $and: [{ _id: scheduleId }, { tenant: tenantId }] }).exec();
    return schedule as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deleteOneSchedule = async (tenantId: string, scheduleId: string): Promise<void> => {
  try {
    await SchedulesModel.deleteOne({ $and: [{ _id: scheduleId }, { tenant: tenantId }] }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findRepeatSchedules = async (tenantId: string, body: IFindScheduleDetail): Promise<any> => {
  try {
    return await SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        { start: { $gte: body.start } },
        { $or: [{ owner: body.owner }, { parent: body.owner }] },
        { baseOn: body.baseOn ? body.baseOn : body._id }
      ]
    }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const checkSchedule = async (tenantId: string, query: IFindSchedulesQuery): Promise<boolean> => {
  try {
    const existedSchedules = await SchedulesModel.find({
      $and: [
        { tenant: tenantId },
        {
          $or: [
            { start: { $gt: query.start, $lt: query.end } },
            { end: { $gt: query.start, $lt: query.end } }
          ]
        },
        { $or: [{ owner: query.tutorId }, { parent: query.tutorId }] }
      ]
    }).exec();

    if (existedSchedules && existedSchedules.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const checkSessionInsideTutorSchedule = async (tenantId: string, query: any): Promise<boolean> => {
  try {
    const existedSchedule = await SchedulesModel.findOne({
      tenant: tenantId,
      start: {$lte: query.start},
      end : {$gte: query.end},
      type: 'tutor',
      isGroup : {$ne: true},
      $or: [{ owner: query.tutor }, { parent: query.tutor }]
    })
    return existedSchedule ? true : false;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findScheduleByTime = async (tenantId: string, body: IRescheduleInput): Promise<IFindScheduleDetail> => {
  try {
    console.log('body', body, tenantId);
    return await SchedulesModel.findOne({tenant: tenantId, start: { $gte: new Date(body.oldStart)}, end: { $lte: new Date(body.oldEnd)}, owner: body.studentId }).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCompletedSchedules = async (checkMoment: String): Promise<void> => {
  try {
    await SchedulesModel.updateMany({
      $and: [
        { end: { $lte: checkMoment } },
        { isCompleted: false }
      ]
    }, { $set: { isCompleted: true } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updatePaymentComplete = async (tenantId: string, schedulesId: Array<string>): Promise<void> => {
  try {
    await SchedulesModel.updateMany({ tenant: tenantId, _id: { $in: schedulesId } },
      { $set: { isPayment: true } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findGroupSchedules = async (tenant: string, body: IFindGroupSchedule): Promise<any> => {
  try {
    return await SchedulesModel.findOne({
      tenant: tenant,
      owner: { $ne: body.tutor },
      $or: [
        { start: { $gte: body.period.start, $lte: body.period.end } },
        { end: { $gte: body.period.start, $lte: body.period.end } }
      ],
      type: 'tutor',
      isGroup: true
    }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const deleteScheduleByTime = async (tenantId: string, scheduleInfo: { start: Date; end: Date; owner: string }): Promise<void> => {
  try {
    await SchedulesModel.findOneAndDelete({
      $and: [
        { tenant: tenantId },
        { start: { $gte: scheduleInfo.start } },
        { end: { $lte: scheduleInfo.end } },
        { owner: scheduleInfo.owner }
      ]
    })
      .exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  findSchedules,
  createNewSchedule,
  findScheduleById,
  updateSchedule,
  deleteOneSchedule,
  checkSchedule,
  createMultipleSchedules,
  findSchedulesForCheckBookings,
  findScheduleByTime,
  deleteSchedules,
  updateCompletedSchedules,
  findRepeatSchedules,
  findGroupSchedules,
  updatePaymentComplete,
  deleteScheduleByTime,
  findByUserId,
  trialScheduleByUserId,
  checkSessionInsideTutorSchedule
};

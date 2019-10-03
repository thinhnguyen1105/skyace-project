import TransactionModel from './mongoose';
import { IFindTransactionDetail, ICreateTransactionInput, IFindTransactionsQuery, IFindTransactionsResult } from './interface';

const findTransactions = async (tenantId: string, query: IFindTransactionsQuery): Promise<IFindTransactionsResult> => {
  try {
    const totalPromise = TransactionModel.find({$and: [
      // query.search ??
      {tenant: tenantId}
    ]})
      .countDocuments()
      .exec();

    const dataPromise = TransactionModel.find({$and: [
      // query.search ??
      {tenant: tenantId}
    ]})
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
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
            model: 'Subject',
          }, {
            path: 'grade',
            model: 'Grade'
          }]
        }, {
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }]
      }])
      .populate([{
        path: 'groupTuition',
        model: 'GroupTuition',
        populate: [{
          path: 'courseForTutor',
          model: 'CourseForTutor'
        }]
      }])
      .populate('tutor')
      .populate('student')
      .populate('promoCode')
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);
    const dataReturned = data.map((val) => {
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
    return {
      total,
      data: dataReturned
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const create = async (tenantId: string, transaction: ICreateTransactionInput): Promise<IFindTransactionDetail> => {
  try {
    const newTransaction = new TransactionModel({
      ...transaction,
      tenant: tenantId,
    });
    return await newTransaction.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findById = async (_id: string): Promise<any> => {
  const transaction = await TransactionModel.findOne({_id})
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
          model: 'Subject',
        }, {
          path: 'grade',
          model: 'Grade'
        }]
      }, {
        path: 'courseForTutor',
        model: 'CourseForTutor'
      }]
    }])
    .populate([{
      path: 'groupTuition',
      model: 'GroupTuition',
      populate: [{
        path: 'courseForTutor',
        model: 'CourseForTutor'
      }]
    }])
    .populate('tutor')
    .populate('student')
    .populate('promoCode')
    .exec();

  let clone = JSON.parse(JSON.stringify(transaction));
  if (clone && clone.tuition && clone.tuition.course) {
    clone.tuition.course = {
      ...clone.tuition.course,
      level: clone.tuition.course.level ? clone.tuition.course.level.name : undefined,
      grade: clone.tuition.course.grade ? clone.tuition.course.grade.name : undefined,
      subject: clone.tuition.course.subject ? clone.tuition.course.subject.name : undefined,
    }
    return clone;
  }
}

const update = async (transaction: any): Promise<IFindTransactionDetail> => {
  try {
    return await TransactionModel.findOneAndUpdate({_id: transaction._id}, {$set: transaction}, {new: true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateByTuitionId = async (tenantId: string, transaction: any): Promise<any> => {
  try {
    return await TransactionModel.findOneAndUpdate({tuition: transaction.tuition, tenant: tenantId}, {$set: transaction}, {new: true}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findAllTransactions = async (tenantId: string): Promise<any> => {
  try {
    return await TransactionModel.find({tenant: tenantId}).populate('tutor').populate('tuition').populate('student').populate('promoCode').exec();
  } catch (err) {
    throw new Error(err.message || 'Internal server error.');
  }
}

export {
  findTransactions,
  create,
  update,
  findAllTransactions,
  updateByTuitionId,
  findById
};
import RatingModel from './mongoose';
import { IFindRatingsResult, IFindRatingDetail, ICreateRatingInput, IUpdateRatingInput, IFindByUserIdInput } from './interface';
import SessionModel from '../sessions/mongoose';
import UserModel from '../../auth/users/mongoose';
import { synchronizeUsers } from '../../../elasticsearch/service';

const findByUserId = async (tenantId: string, query: IFindByUserIdInput): Promise<IFindRatingsResult> => {
  try {
    const totalPromise = RatingModel.find({ $and: [{ tutor: query.userId }, { tenant: tenantId }] })
      .countDocuments()
      .exec();

    const allFiveStars= RatingModel.find({ tutor: query.userId, tenant: tenantId, rateSession: {$gte : 4.5}}).countDocuments().exec();
    const allFourStars = RatingModel.find({ tutor: query.userId, tenant: tenantId, rateSession: {$gte : 3.5 , $lte : 4} }).countDocuments().exec();
    const allThreeStars = RatingModel.find({ tutor: query.userId, tenant: tenantId, rateSession: {$gte : 2.5 , $lte : 3} }).countDocuments().exec();
    const allTwoStars = RatingModel.find({ tutor: query.userId, tenant: tenantId, rateSession: {$gte : 1.5 , $lte : 2} }).countDocuments().exec();
    const allOneStar = RatingModel.find({ tutor: query.userId, tenant: tenantId, rateSession: {$gte : 0.5 , $lte : 1} }).countDocuments().exec();

    const dataPromise = RatingModel.find({ $and: [{ tutor: query.userId }, { tenant: tenantId }] })
      .sort('createdAt')
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('uploadBy')
      .populate('tutor')
      .exec();

    const [total, data, five, four, three, two, one] = await Promise.all([totalPromise, dataPromise, allFiveStars, allFourStars, allThreeStars, allTwoStars, allOneStar]);
    const stars = {
      five, four, three, two, one
    }

    return {
      total,
      data,
      stars
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findById = async (tenantId: string, _id: string): Promise<IFindRatingDetail> => {
  try {
    return await RatingModel.findOne({tenant: tenantId, _id: _id}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const create = async (tenantId: string, body: ICreateRatingInput): Promise<IFindRatingDetail> => {
  try { 
    const newRating = new RatingModel({
      rateSession: body.rateSession,
      commentSession: body.commentSession,
      uploadBy: body.uploadBy,
      tenant: tenantId,
      uploadDate: new Date(),
      tutor: body.tutor
    })
    return newRating.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const update = async (tenantId: string, body: IUpdateRatingInput): Promise<IFindRatingDetail> => {
  try {
    return await RatingModel.findOneAndUpdate({_id: body._id, tenant: tenantId}, {$set: body}, {new : true}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const migrateRatings = async (): Promise<void> => {
  try {
    // Migrate database for ratings
    await RatingModel.deleteMany({}).exec();
    await SessionModel.updateMany({}, {$set: {rateSession : []}}).exec();
    await UserModel.updateMany({}, {$set: {rating: 0}}).exec();
    await synchronizeUsers({});
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

export {
  findByUserId,
  findById,
  create,
  update,
  migrateRatings
};

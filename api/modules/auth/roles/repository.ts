import RolesModel from './mongoose';
import { IFindRolesQuery, IFindRolesResult, IFindRoleDetail, ICreateRoleInput, IUpdateRoleInput, IActivateRole } from './interface';

const addQuery = (query: IFindRolesQuery): any => {
  return RolesModel.find({
    $and: [
      query.search ? {normalizedName: { $regex: `^${query.search}`, $options: 'i' }} : {},
      query.filter ? {permissions: {$all: query.filter}} : {}
    ]
  });
};

const findRoles = async (query: IFindRolesQuery): Promise<IFindRolesResult> => {
  try {
    // Exec query
    const totalPromise = addQuery(query)
      .countDocuments()
      .exec();

    const dataPromise = addQuery(query)
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
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

const findRoleByName = async (rolename: string): Promise<IFindRoleDetail> => {
  try {
    return await RolesModel.findOne({normalizedName: rolename}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findRoleById = async (roleId: string): Promise<IFindRoleDetail> => {
  try {
    return await RolesModel.findOne({_id: roleId}).exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createNewRole = async (
  body: ICreateRoleInput
): Promise<IFindRoleDetail> => {
  try {
    const newRole = new RolesModel({
      ...body,
      isActive: false,
      isDefault: body.isDefault === undefined ? false : true,
    });
    return await newRole.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update user in local login */
const updateRole = async (
  body: IUpdateRoleInput
): Promise<void> => {
  try {
    await RolesModel.updateOne(
      {_id: body._id},
      { $set: body }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const activateRole = async (
  params: IActivateRole
): Promise<void> => {
  try {
    await RolesModel.updateOne(
      { _id: params.roleId},
      { $set: { ...params, isActive: true } }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deactivateRole = async (
  params: IActivateRole
): Promise<void> => {
  try {
    await RolesModel.updateOne(
      {_id: params.roleId},
      { $set: { ...params, isActive: false } }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

export {
  deactivateRole,
  activateRole,
  updateRole,
  createNewRole,
  findRoleById,
  findRoleByName,
  findRoles,
};

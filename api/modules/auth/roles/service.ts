import * as Joi from 'joi';
import * as rolesRepository from './repository';
import { ICreateRoleInput, IFindRolesQuery, IFindRolesResult, IFindRoleDetail, IUpdateRoleInput, IActivateRole } from './interface';

const addNormalizeName = (role: ICreateRoleInput) => {
  const normalizedName = role.name.toLocaleLowerCase();

  return {
    ...role,
    normalizedName,
  };
};

const findRoles = async (query: IFindRolesQuery): Promise<IFindRolesResult> => {
  return await rolesRepository.findRoles(query);
};

const createRole = async (body: ICreateRoleInput): Promise<IFindRoleDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array().required(),
    isDefault: Joi.boolean(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Name Exist
  const existedRole = await rolesRepository.findRoleByName(body.name);
  if (existedRole) {
    throw new Error('Role name has been used.');
  }

  // Add Normalized Name
  const roleWithNormalizeName = addNormalizeName(body);

  // Save to db
  return await rolesRepository.createNewRole(roleWithNormalizeName);
};

/** update local user */
const updateRole = async (body: IUpdateRoleInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string(),
    permissions: Joi.array(),
    isDefault: Joi.boolean(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If RoleId Exist
  const existedRole = await rolesRepository.findRoleById(body._id);
  if (!existedRole) {
    throw new Error('Role not found');
  }

  // Update
  await rolesRepository.updateRole(body);
};

const activateRole = async (params: IActivateRole): Promise<void> => {
  // Check RoleId
  if (!params.roleId) {
    throw new Error('Role ID is empty');
  }

  // Check If RoleId Exist
  const existedRole = await rolesRepository.findRoleById(params.roleId);
  if (!existedRole) {
    throw new Error('Role not found');
  }

  // Activate
  await rolesRepository.activateRole(params);
};

const deactivateRole = async (params: IActivateRole): Promise<void> => {
  // Check RoleId
  if (!params.roleId) {
    throw new Error('Role ID is empty');
  }

  // Check If RoleId Exist
  const existedRole = await rolesRepository.findRoleById(params.roleId);
  if (!existedRole) {
    throw new Error('Role not found');
  }

  // Activate
  await rolesRepository.deactivateRole(params);
};

export default {
  findRoles,
  createRole,
  updateRole,
  activateRole,
  deactivateRole,
};
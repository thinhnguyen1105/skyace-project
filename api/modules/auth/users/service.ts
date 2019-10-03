import * as Joi from 'joi';
import * as usersRepository from './repository';
import { ICreateUserInput, IFindUsersQuery, IFindUsersResult, IUpdateUserInput, IActivateUser, IFindUserDetail, IFindUsersESResult, ICreateAdminUserForNewTenant, IChangePasswordInput, ICreateFranchise } from './interface';
import config from '../../../config';
import * as bcrypt from 'bcryptjs';
import { synchronizeUsers } from '../../../elasticsearch/service';
import notificationQueue from '../../../notification-job-queue';

let nodeXlsx = require('node-xlsx');

const addFullName = (user: ICreateUserInput) => {
  const normalizedFullName = [user.firstName, user.lastName]
    .join(' ')
    .toLocaleLowerCase();

  const fullName = [user.firstName, user.lastName].join(' ');

  return {
    ...user,
    normalizedFullName,
    fullName,
  };
};

const findUsers = async (tenantId: string, query: IFindUsersQuery): Promise<IFindUsersResult> => {
  return await usersRepository.findUsers(tenantId, query);
};

const findFranchises = async (query: IFindUsersQuery): Promise<IFindUsersResult> => {
  return await usersRepository.findFranchises(query);
}

const findById = async (userId: string): Promise<IFindUserDetail> => {
  return await usersRepository.findUserById(userId);
};

const findTutorById = async (tenantId: string, userId: string): Promise<IFindUserDetail> => {
  return await usersRepository.findTutorById(tenantId, userId);
};
const findStudentById = async (tenantId: string, userId: string): Promise<IFindUserDetail> => {
  return await usersRepository.findStudentById(tenantId, userId);
};

const findTenantAdmin = async (tenant: string): Promise<IFindUserDetail[]> => {
  return await usersRepository.findTenantAdmin(tenant);
}

const getAllFranchiseName = async (): Promise<any> => {
  return await usersRepository.getAllFranchiseName();
}

const createUser = async (tenantId: string, body: ICreateUserInput): Promise<IFindUserDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.object().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Email Exist
  const existedUser = await usersRepository.findUserByEmail(tenantId, body.email);
  if (existedUser) {
    throw new Error('Email has been used.');
  }

  // Add Fullname, hash Password
  const userWithFullname = addFullName(body);
  const userWithHashPassword = {
    ...userWithFullname,
    password: await bcrypt.hash(userWithFullname.password, userWithFullname.password.length),
  };

  // Save to db
  const newUser = await usersRepository.createNewUser(tenantId, userWithHashPassword);
  syncElasticSearch(tenantId);
  return newUser;
};

const changePassword = async (tenantId: string, body: IChangePasswordInput): Promise<void> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    oldPassword: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    newPassword: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    confirmNewPassword: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }
  if (body.newPassword !== body.confirmNewPassword) {
    throw new Error('New password and confirm new password do not match.');
  }
  const user = await usersRepository.findUserWithPasswordById(tenantId, body._id);
  if (!user) {
    throw new Error('Cannot find user.');
  }
  if (!bcrypt.compareSync(body.oldPassword, user.password ? user.password : '')) {
    throw new Error('Password does not match.')
  }
  await usersRepository.updateUser({
    _id: body._id,
    password: await bcrypt.hash(body.newPassword, body.newPassword.length)
  } as any);
}


const createAdminUserForNewTenant = async (body: ICreateAdminUserForNewTenant): Promise<any> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    tenant: Joi.string().required(),
    roles: Joi.array().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Add Fullname, hash Password
  const userWithFullname = addFullName(body as any);
  const userWithHashPassword = {
    ...userWithFullname,
    password: bcrypt.hashSync(userWithFullname.password, 10),
    isActive: true,
    emailConfirmed: true,
  };

  // Save to db
  return await usersRepository.createNewUser(body.tenant, userWithHashPassword);
};

const createFranchise = async (tenant: string, body: ICreateFranchise): Promise<any> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    distributorInfo: Joi.object().required(),
    phone: Joi.object().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Add Fullname, hash Password
  const userWithFullname = addFullName(body as any);
  const userWithHashPassword = {
    ...userWithFullname,
    password: bcrypt.hashSync(userWithFullname.password, 10),
    isActive: true,
    roles: ['franchise'],
    emailConfirmed: true,
  };

  notificationQueue.create('distributorCreationEmail', {
    title: 'Distributor Account Creation Email',
    receiverEmail: userWithHashPassword.email,
    mailSubject: 'Welcome to SkyAce!',
    domain: config.nextjs.hostUrl,
    partner: body.distributorInfo ? body.distributorInfo.companyName : '',
    adminName: userWithHashPassword.fullName,
    email: userWithHashPassword.email,
    password: body.password
  }).save();

  // Save to db
  return await usersRepository.createNewUser(tenant, userWithHashPassword);
}

/** update local user */
const updateUser = async (tenantId: string, body: IUpdateUserInput): Promise<any> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    email: Joi.string().email(),
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    currency: Joi.string(),
    timeZone: Joi.object(),
    dob: Joi.date(),
    roles: Joi.array(),
    permissions: Joi.array(),
    biography: Joi.object(),
    education: Joi.object(),
    teacherExperience: Joi.array(),
    teacherSubject: Joi.object(),
    password: Joi.string(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If UserId Exist
  const existedUser = await usersRepository.findUserById(body._id);
  if (!existedUser) {
    throw new Error('User does not exist.');
  }

  // Update
  if (body.password) {
    await usersRepository.updateUser({
      ...body,
      password: await bcrypt.hash(body.password, body.password.length),
      fullName: [body.firstName ? body.firstName : existedUser.firstName, body.lastName ? body.lastName : existedUser.lastName].join(' '),
    });
  } else {
    await usersRepository.updateUser({
      ...body,
      fullName: [body.firstName ? body.firstName : existedUser.firstName, body.lastName ? body.lastName : existedUser.lastName].join(' '),
    });
  }
  if (body.hourlyPerSessionTrial >= 0) {
    enableFunctionOfTrialButton(body._id, tenantId, body.hourlyPerSessionTrial);
  }
  syncElasticSearch(tenantId);
};

/** verify email for sign up */
const verifyEmail = async (params: IActivateUser): Promise<any> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID is empty.');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User does not exist.');
  }

  // Verify Email
  return await usersRepository.verifyEmail(params);
};

/** update socical user */
const updateSocialUser = async (tenantId: string, body: IUpdateUserInput): Promise<void> => {
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    roles: Joi.array().required(),
    phone: Joi.object().required(),
  });

  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If UserId Exist
  const existedUser = await usersRepository.findUserById(body._id);
  if (!existedUser) {
    throw new Error('User does not exist.');
  }

  await usersRepository.updateSocialUser(tenantId, body);
};

/** active user */
const activateUser = async (tenantId: string, params: IActivateUser): Promise<void> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID is empty.');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User does not exist.');
  }

  // Activate
  await usersRepository.activateUser(tenantId, params);
};

/** deactive user */
const deactivateUser = async (params: IActivateUser): Promise<void> => {
  // Check UserId
  if (!params.userId) {
    throw new Error('User ID is empty.');
  }

  // Check if User exist
  const existedUser = await usersRepository.findUserById(params.userId);
  if (!existedUser) {
    throw new Error('User does not exist.');
  }

  await usersRepository.deactivateUser(params);
};

const searchUsers = async (tenant: string, query: any): Promise<IFindUsersESResult> => {
  if (!query) {
    throw new Error('Query is empty!');
  }

  const results = await usersRepository.searchUsers(tenant, query);
  return results;
};

const generateTestData = async (tenantId: string): Promise<void> => {
  await usersRepository.generateTestData(tenantId);
};

const syncElasticSearch = async (tenantId: string): Promise<void> => {
  await synchronizeUsers({ tenant: tenantId });
};

const enableFunctionOfTrialButton = async (tutorId: string, tenantId: string, hourPerSession: number): Promise<void> => {
  await usersRepository.enableFunctionOfTrialButton(tutorId, tenantId, hourPerSession);
}

const removeOldCurrencyAndTimeZoneFromUsers = async (): Promise<void> => {
  await usersRepository.removeOldCurrencyAndTimeZoneFromUsers();
}

const exportDistributors = async (): Promise<any> => {
  var data = await usersRepository.findDistributors();
  let dataExcel = [] as any;

  let arrHeaderTitle = [] as any;
  arrHeaderTitle.push('UID');
  arrHeaderTitle.push('Name');
  arrHeaderTitle.push('Email');
  arrHeaderTitle.push('Phone');
  arrHeaderTitle.push('Created At');
  arrHeaderTitle.push('Is Active');
  arrHeaderTitle.push('Company Name');
  arrHeaderTitle.push('Country Of Business');
  arrHeaderTitle.push('Company Registration No.');
  arrHeaderTitle.push('Start Date');
  arrHeaderTitle.push('End Date');
  arrHeaderTitle.push('Monthly payment day');
  arrHeaderTitle.push('Monthly payment amount');
  dataExcel.push(arrHeaderTitle);

  if (data && data.length) {
    for (let item of data) {
      if (item && item._doc) {
        let rowItemValue = [] as any;
        rowItemValue.push(item._doc._id || "N/A");
        rowItemValue.push(item._doc.fullName || "N/A");
        rowItemValue.push(item._doc.email || "N/A");
        const phone = item._doc.phone ? (item._doc.phone.phoneNumber ? ((item._doc.phone.phoneID || "") + " " + item._doc.phone.phoneNumber) : "N/A"): "N/A";
        rowItemValue.push(phone || "N/A");
        const createdAt = item._doc.createdAt ? item._doc.createdAt.toDateString() : "N/A"
        rowItemValue.push(createdAt || "N/A");
        rowItemValue.push(item._doc.isActive || "N/A");
        const companyName = item._doc.distributorInfo ? item._doc.distributorInfo.companyName || "N/A" : "N/A"
        rowItemValue.push(companyName || "N/A");
        const countryOfBusiness = item._doc.distributorInfo ? item._doc.distributorInfo.countryOfBusiness || "N/A" : "N/A"
        rowItemValue.push(countryOfBusiness || "N/A");
        const companyRegNo = item._doc.distributorInfo ? item._doc.distributorInfo.companyRegNo || "N/A" : "N/A"
        rowItemValue.push(companyRegNo || "N/A");
        const startDate = item._doc.distributorInfo ? (item._doc.distributorInfo.startDate ? new Date(item._doc.distributorInfo.startDate).toDateString() : "N/A") : "N/A"
        rowItemValue.push(startDate || "N/A");
        const endDate = item._doc.distributorInfo ? (item._doc.distributorInfo.endDate ? new Date(item._doc.distributorInfo.endDate).toDateString() : "N/A") : "N/A"
        rowItemValue.push(endDate || "N/A");    
        const dayInMonth = item._doc.distributorInfo ? item._doc.distributorInfo.dayInMonth || "N/A" : "N/A";
        rowItemValue.push(dayInMonth || "N/A");
        const amount = item._doc.distributorInfo ? item._doc.distributorInfo.fixedAmount || "N/A" : "N/A";
        rowItemValue.push(amount || "N/A");
        dataExcel.push(rowItemValue);
      }
    }
  }

  let buffer = nodeXlsx.build([{ name: "List Distributor", data: dataExcel }])
  return buffer;
}

const exportUsers = async (tenant: string, query: string): Promise<any> => {
  var data = await usersRepository.findAllUsers(query ? query : tenant);
  let dataExcel = [] as any;

  let arrHeaderTitle = [] as any;
  arrHeaderTitle.push('UID');
  arrHeaderTitle.push('Full Name');
  arrHeaderTitle.push('Email');
  arrHeaderTitle.push('Role');
  arrHeaderTitle.push('Phone');
  arrHeaderTitle.push('Created At');
  arrHeaderTitle.push('Is Active');
  dataExcel.push(arrHeaderTitle);
  if (data && data.length) {

    for (let item of data) {
      if (item && item._doc) {
        let rowItemValue = [] as any;
        rowItemValue.push(item._doc._id || "N/A");
        rowItemValue.push(item._doc.fullName || "N/A");
        rowItemValue.push(item._doc.email || "N/A");
        rowItemValue.push(item._doc.roles[0] === 'franchise' ? 'distributor' : item._doc.roles[0]);
        const phone = item._doc.phone ? (item._doc.phone.phoneNumber ? ((item._doc.phone.phoneID || "") + " " + item._doc.phone.phoneNumber) : "N/A"): "N/A";
        rowItemValue.push(phone || "N/A");
        const createdAt = item._doc.createdAt ? item._doc.createdAt.toDateString() : "N/A"
        rowItemValue.push(createdAt || "N/A");
        rowItemValue.push(item._doc.isActive || "N/A");
        dataExcel.push(rowItemValue);
      }
    }
  }

  let buffer = nodeXlsx.build([{ name: "List Users", data: dataExcel }])
  return buffer;
}

const getPaymentOfDistributor = async (_id: string): Promise<any> => {
  return await usersRepository.findAllPaymentsOfDistributor(_id);
}

const updateDistributorPaycheck = async (query: any): Promise<void> => {
  await usersRepository.updateDistributorPaycheck(query._id, query.date);
}

const getDistributorPaycheck = async (_id: string): Promise<any> => {
  return await usersRepository.getDistributorPaycheck(_id);
}

export default {
  findUsers,
  createUser,
  updateUser,
  activateUser,
  deactivateUser,
  updateSocialUser,
  findById,
  searchUsers,
  verifyEmail,
  findTutorById,
  findStudentById,
  generateTestData,
  syncElasticSearch,
  createAdminUserForNewTenant,
  removeOldCurrencyAndTimeZoneFromUsers,
  changePassword,
  findTenantAdmin,
  findFranchises,
  createFranchise,
  getAllFranchiseName,
  exportDistributors,
  exportUsers,
  getPaymentOfDistributor,
  updateDistributorPaycheck,
  getDistributorPaycheck
};
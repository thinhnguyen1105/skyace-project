import * as Joi from 'joi';
import * as userRepository from '../users/repository';
import { ICreateUserInput } from '../users/interface';
import * as bcrypt from 'bcryptjs';
import config from '../../../config';
import notificationQueue from '../../../notification-job-queue';
import notificationSettingsService from '../../host/notification-settings/service';

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

const checkEmail = async (tenantId: string, email: string) => {
  if (!email) {
    throw new Error('Bad request.');
  }

  // check if email exist
  const existedUser = await userRepository.findUserByEmail(tenantId, email);
  if (existedUser) {
    return true;
  } else {
    return false;
  }
};

const registerUser = async (tenantId: string, body: ICreateUserInput ): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(config.usersModuleConfig.passwordRegex).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.object().required(),
    roles: Joi.array().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // check if email exist
  const existedUser = await userRepository.findUserByEmail(tenantId, body.email);
  if (existedUser) {
    throw new Error('Email has been used.');
  }

  // create new user
  const userWithFullname = addFullName(body);
  const userWithHashPassword = {
    ...userWithFullname,
    isActive: true,
    emailConfirmed: false,
    password: await bcrypt.hash(userWithFullname.password, userWithFullname.password.length),
  };
  const newUser: any =  await userRepository.createNewUser(tenantId, userWithHashPassword);

  // Push send mail and sms to job queue
  const notificationSetting = await notificationSettingsService.findSettingByTenantId(tenantId);
  if (notificationSetting.accountRegistration.email) {
    notificationQueue.create('accountCreationEmail', {
      title: 'Account Creation Email',
      receiverEmail: newUser.email,
      receiverPhone: `${newUser.phone.phoneID}${newUser.phone.phoneNumber}`,
      isStudent: newUser.roles.indexOf('student') > -1 ? true : false,
      mailSubject: 'Welcome to SkyAce!',

      studentName: newUser.fullName,
      tutorName: newUser.fullName,
      activateUrl: `${config.nextjs.apiUrl}/users/verifyEmail/${newUser._id}`,
    }).save();
  }
  if (notificationSetting.accountRegistration.sms) {
    notificationQueue.create('accountCreationSms', {
      title: 'Account Creation Sms',
      receiverPhone: `${newUser.phone.phoneID}${newUser.phone.phoneNumber}`,
      isStudent: newUser.roles.indexOf('student') > -1 ? true : false,

      studentName: newUser.fullName,
      tutorName: newUser.fullName,
    }).save();
  }
};

export default {
  registerUser,
  checkEmail
};
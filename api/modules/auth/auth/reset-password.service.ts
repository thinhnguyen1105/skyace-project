import * as userRepository from '../../auth/users/repository';
import * as jwt from 'jsonwebtoken';
import config from '../../../config';
import { IUpdatePasswordInput } from './interface';
import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import notificationQueue from '../../../notification-job-queue';

const sendResetPasswordEmail = async (tenant: any, email: string): Promise<void> => {
  if (!email) {
    throw new Error('Bad request');
  }

  const existedAccount = await userRepository.findUserByEmail(tenant._id, email);
  if (!existedAccount) {
    throw new Error('Email didnt exist');
  }

  const tokenData = {
    _id: existedAccount._id,
    email,
  };

  const resetPasswordToken =  await jwt.sign(tokenData, config.auth.secret, { expiresIn: config.auth.expiresIn });
  const resetPasswordUrl = `${tenant.name === 'admin' ? config.nextjs.hostUrl : config.nextjs.tenantUrl.replace('<%tenant%>', tenant.name)}/reset-password?token=${resetPasswordToken}`;
  
  notificationQueue.create('resetPasswordEmail', {
    title: 'Reset password email',
    receiverEmail: existedAccount.email,
    mailSubject: 'SkyAce - Reset Password!',
    userName: existedAccount.fullName,
    resetPasswordUrl,
  }).save();
};

const updateNewPassword = async (body: IUpdatePasswordInput): Promise<void> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  await userRepository.updateUser({
    _id: body.userId,
    password: await bcrypt.hash(body.newPassword, body.newPassword.length),
  } as any);
};

export default {
  sendResetPasswordEmail,
  updateNewPassword,
};

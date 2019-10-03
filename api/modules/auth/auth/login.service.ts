import * as Joi from 'joi';
import * as userRepository from '../../auth/users/repository';
import { IFindUserDetail } from '../../auth/users/interface';
import config from '../../../config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { ILoginInput, ITokenData, ILoginWithSocialAccountInput } from './interface';

const login = async (tenantId: string, body: ILoginInput): Promise<String> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check Email and Password
  const existedUser = await userRepository.findUserForLogin(tenantId, body);
  if (!existedUser) {
    throw new Error('Email does not exist.');
  } else if (!existedUser.emailConfirmed) {
    throw new Error('Email is not activated.');
  } else if (!existedUser.isActive) {
    throw new Error('This account is currently deactivated. Please contact your admin.');
  } else if (!bcrypt.compareSync(body.password, existedUser.password ? existedUser.password : '')) {
    throw new Error('Email or password is incorrect.');
  } else {
    return await createToken(tenantId, existedUser);
  }
};

const loginWithSocialAccount = async (tenantId: string, body: ILoginWithSocialAccountInput): Promise<string> => {
  // validate body
  const validationRule = Joi.object().keys({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    externalLogin: Joi.object().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // if user exist => create token. if not => create a new user => create token
  let token: string = '';
  let existedUser: any = {};
  if (body.email) {
    existedUser = await userRepository.findUserByEmail(tenantId, body.email);
    if (existedUser) {
      // Update user's social info
      await userRepository.updateUser({
        _id: existedUser._id,
        externalLogin: body.externalLogin,
      } as any);
      token = await createToken(tenantId, existedUser);
    } else {
      existedUser = await userRepository.findUserBySocialCredential(tenantId, body.externalLogin.facebook ? body.externalLogin.facebook.id : body.externalLogin.google ? body.externalLogin.google.id : '');
      if (existedUser) {
        token = await createToken(tenantId, existedUser);
      } else {
        const newUser = await userRepository.createUserBySocialCredential(tenantId, {
          ...body,
          normalizedFullName: [body.firstName, body.lastName].join(' ').toLocaleLowerCase() === ' ' ? '' : [body.firstName, body.lastName].join(' ').toLocaleLowerCase(),
          fullName: [body.firstName, body.lastName].join(' ') === ' ' ? '' : [body.firstName, body.lastName].join(' '),
        });
        token = await createToken(tenantId, newUser);
      }
    }
  } else {
    existedUser = await userRepository.findUserBySocialCredential(tenantId, body.externalLogin.facebook ? body.externalLogin.facebook.id : body.externalLogin.google ? body.externalLogin.google.id : '');
    if (existedUser) {
      token = await createToken(tenantId, existedUser);
    } else {
      const newUser = await userRepository.createUserBySocialCredential(tenantId, {
        ...body,
        normalizedFullName: [body.firstName, body.lastName].join(' ').toLocaleLowerCase() === ' ' ? '' : [body.firstName, body.lastName].join(' ').toLocaleLowerCase(),
        fullName: [body.firstName, body.lastName].join(' ') === ' ' ? '' : [body.firstName, body.lastName].join(' '),
      });
      token = await createToken(tenantId, newUser);
    }
  }

  return token;
};

const createToken =  async (_tenantId: string, user: IFindUserDetail): Promise<string> => {
  const tokenData: ITokenData = {
    _id: user._id,
    email: user.email ? user.email : '',
    firstName: user.firstName ? user.firstName : '',
    lastName: user.lastName ? user.lastName : '',
    fullName: user.fullName ? user.fullName : '',
    permissions: user.permissions ? user.permissions : [],
    roles: user.roles ? user.roles : [],
    language: user.language ? user.language : 'en',
    tenant:  user.tenant,
    timeZone: user.timeZone,
    currency: user.currency,
    phone: user.phone,
    firstTimeLoggedIn: user.firstTimeLoggedIn || false,
    distributorInfo: user.distributorInfo || null,
    lang: user.lang || null
  } as any;
  const expiresIn = config.auth.expiresIn;

  return await jwt.sign(tokenData, config.auth.secret, { expiresIn });
};

const refreshToken = async(tenantId: string, token: string): Promise<string> => {
  let oldTokenData: ITokenData = {} as any;
  try {
    oldTokenData = jwt.verify(token, config.auth.secret) as any;
  } catch (error) {
    throw new Error('Invalid token.');
  }

  if (oldTokenData && oldTokenData.exp && oldTokenData.exp < Math.round(new Date().getTime() / 1000)) {
    throw new Error('Token expired.');
  }

  const user: any = await userRepository.findUserById(oldTokenData._id);
  return await createToken(tenantId, user);
};

const impersonate = async (tenantId: string, body: any): Promise<String> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    user_id: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check Email and Password
  const existedUser = await userRepository.findUserForImpersonate(tenantId, body.user_id);
  if (!existedUser) {
    throw new Error('Email does not exist.');
  } else if (!existedUser.emailConfirmed) {
    throw new Error('Email is not activated.');
  } else if (!existedUser.isActive) {
    throw new Error('This account is currently deactivated. Please contact your admin.');
  } else {
    return await createToken(tenantId, existedUser);
  }
}

export default {
  login,
  refreshToken,
  createToken,
  loginWithSocialAccount,
  impersonate
};
import * as Joi from 'joi';
import * as tenantsRepository from './repository';
import * as usersRepository from '../users/repository';
import * as tuitionsRepository from '../../elearning/tuitions/repository';
import * as sessionsRepository from '../../elearning/sessions/repository';
import * as fs from 'fs';
import * as util from 'util';
import { ICreateTenantInput, IFindTenantDetail, IFindTenantsQuery, IFindTenantsResult, IUpdateTenantInput, IActivateTenant, ICompanyProfile, IAdminInfor, IConfiguration, IContractInfo, IBankTransfer, IPaypal, ICommissionFee, IFindTenantsByAdminQuery } from './interface';
import config from '../../../config';
import usersService from '../users/service';
import landingPageService from '../../website/landing-page/service';
import notificationSettingsService from '../../host/notification-settings/service';
import notificationQueue from '../../../notification-job-queue';
let nodeXlsx = require('node-xlsx');

const findTenants = async (query: IFindTenantsQuery): Promise<IFindTenantsResult> => {
  return await tenantsRepository.findTenants(query);
};

const findTenantById = async (_id: string): Promise<IFindTenantDetail> => {
  return await tenantsRepository.findTenantById(_id);
};

const findTenantByName = async (tenantName: string): Promise<IFindTenantDetail> => {
  return await tenantsRepository.findTenantByName(tenantName);
};

const findTenantByDomain = async (domain: string): Promise<IFindTenantDetail> => {
  return await tenantsRepository.findTenantByDomain(domain);
}

const findActiveTenantByDomain = async (domain: string): Promise<IFindTenantDetail> => {
  return await tenantsRepository.findActiveTenantByDomain(domain);
}

const findTenantsByAdmin = async (query: IFindTenantsByAdminQuery): Promise<IFindTenantsResult> => {
  return await tenantsRepository.findTenantsByAdmin(query);
}

const createTenant = async (body: ICreateTenantInput): Promise<IFindTenantDetail> => {
  // Validate Body
  const validationRule = Joi.object().keys({
    companyProfile: Joi.object().required(),
    domain: Joi.string().regex(config.tenantsModuleConfig.domainNameRegex).required(),
    adminCreated: Joi.string().required(),
    password: Joi.string().required(),
    adminEmail: Joi.string().required(),
    adminFirstName: Joi.string().required(),
    adminLastName: Joi.string().required(),
    adminPhoneID: Joi.string().required(),
    adminPhoneNumber: Joi.string().required()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If Name Exist
  const existedTenant = await tenantsRepository.findTenantByName(body.domain);
  if (existedTenant) {
    throw new Error('Partner name has been used.');
  }

  // Save to db
  const name = body.companyProfile.partnerCenterName ? body.companyProfile.partnerCenterName.toLowerCase().replace(/\s/g, "") : "";
  const newTenant = await tenantsRepository.createNewTenant({
    name : body.domain,
    domain: body.domain,
    companyProfile: body.companyProfile,
    adminEmail: body.adminEmail,
    adminFirstName: body.adminFirstName,
    adminLastName: body.adminLastName,
    adminPhoneID: body.adminPhoneID,
    adminPhoneNumber: body.adminPhoneNumber,
    contactInformation: {
      email : body.adminEmail,
      firstName: body.adminFirstName,
      lastName: body.adminLastName,
      name: `${body.adminFirstName} ${body.adminLastName}`,
      contactNumber: {
        phoneID: body.adminPhoneID,
        number: body.adminPhoneNumber
      }
    },
    fileLists : body.fileLists ? JSON.parse(JSON.stringify(body.fileLists)) : [],
    isActive: true,
    adminCreated: body.adminCreated,
    administrationInfomation : {
      adminName : `${name ? name : (body.companyProfile ? body.companyProfile.partnerCenterName : "")}` + ' admin',
      adminEmail : body.adminEmail,
    },
    assignDistributorTime: Date.now(),
    paymentInfo: body.paymentInfo
  } as any);

  const newAdmin = await usersService.createAdminUserForNewTenant({
    email: body.adminEmail,
    password: body.password,
    firstName: body.adminFirstName,
    lastName: body.adminLastName,
    tenant: String(newTenant._id),
    phone: {
      phoneNumber: body.adminPhoneNumber,
      phoneID: body.adminPhoneID
    },
    roles: ['admin'],
    createdAt: new Date(),
  } as any);

  notificationQueue.create('adminCreationEmail', {
    title: 'Admin Account Creation Email',
    receiverEmail: newAdmin.email,
    mailSubject: 'Welcome to SkyAce!',

    adminName: newAdmin.fullName,
    partner: `${newTenant.name ? newTenant.name : (newTenant.companyProfile ? newTenant.companyProfile.partnerCenterName : "")}`,
    email : newAdmin.email,
    password: body.password,
    domain: `https://${newTenant.domain}${config.nextjs.tailUrl}`
  }).save();

  const landingPagePromise = landingPageService.createLandingPageForNewTenant(String(newTenant._id), newTenant.name as any);

  const notificationSettingPromise = notificationSettingsService.createNotificationSetting({
    tenant: String(newTenant._id),
    createdAt: new Date(),
  } as any);

  await Promise.all([landingPagePromise, notificationSettingPromise]);

  return newTenant;
};

/** update name vs _id of tenant */
const updateTenant = async (body: IUpdateTenantInput): Promise<void> => {
  // Validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    tenantName: Joi.string().regex(config.tenantsModuleConfig.tenantNameRegex),
    domainName: Joi.string().regex(config.tenantsModuleConfig.domainNameRegex),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateTenant({
    name: body.domainName,
    companyProfile: {
      registeredCompanyName: body.tenantName,
    },
  } as any);
};

/** update company's profile of tenant */
const updateCompanyProfile = async (body: ICompanyProfile): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    registeredCompanyName: Joi.string().required(),
    companyRegistrationNumber: Joi.string().required(),
    partnerCompanyRegistrationNumber: Joi.string().required(),
    partnerCenterName: Joi.string().required(),
    countryOfRegistration: Joi.string().required(),
    aboutCompany: Joi.string(),
    partnerShipStartDate: Joi.string().required(),
    partnerShipEndDate: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }
  else if(existedTenant.name === 'admin') {
    await tenantsRepository.updateCompanyProfile(body);  
  } else {
    await tenantsRepository.updateCompanyProfileWithName(body);
  }
};

/** update admin's info of tenant */
const updateAdminInfo = async (body: IAdminInfor): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    adminName: Joi.string().required(),
    adminEmail: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateAdminInfor(body);
};

/** update tenant's configuration */
const updateConfiguration = async (body: IConfiguration): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    timeZone: Joi.object().required(),
    primaryCurrency: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateConfiguration(body);
};

/** update tenant's contract */
const updateContracInfo = async (body: IContractInfo): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    country: Joi.string(),
    zipCode: Joi.number(),
    state: Joi.string(),
    city: Joi.string(),
    contactNumber: Joi.object().required(),
    email: Joi.string().required(),
    website: Joi.string(),
    address: Joi.string().required(),
    name: Joi.string(),
    gender: Joi.string()
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateContractInfo(body);
};

/** update tenant's bank transfer */
const updateBankTransfer = async (body: IBankTransfer): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    bankName: Joi.string().required(),
    bankAccount: Joi.string().required(),
    transferDescription: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateBankTransfer(body);
};

/** update tenant's paypal */
const updatePaypal = async (body: IPaypal): Promise<void> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    paypalID: Joi.string().required(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updatePaypal(body);
};

const updateCommissionFee = async (body: ICommissionFee): Promise<any> => {
  // validate body
  const validationRule = Joi.object().keys({
    _id: Joi.string().required(),
    firstPayment: Joi.number(),
    nextPayment: Joi.number(),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Check If TenantId Exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Update
  await tenantsRepository.updateCommissionFee(body);
}

/** active new tenant */
const activateTenant = async (params: IActivateTenant): Promise<void> => {
  // Check UserId
  if (!params.tenantId) {
    throw new Error('Tenant ID is empty.');
  }

  // Check if User exist
  const existedTenant = await tenantsRepository.findTenantById(params.tenantId);
  if (!existedTenant) {
    throw new Error('User does not exist.');
  }

  // Activate
  await tenantsRepository.activateTenant(params);
};

const deactivateTenant = async (params: IActivateTenant): Promise<void> => {
  // Check UserId
  if (!params.tenantId) {
    throw new Error('Tenant ID is empty.');
  }

  // Check if User exist
  const existedTenant = await tenantsRepository.findTenantById(params.tenantId);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }

  // Activate
  await tenantsRepository.deactivateTenant(params);
};

const updateFields = async (body: any): Promise<any> => {
  if(!body._id) {
    throw new Error('Tenant ID is empty.');
  }
  // Check if User exist
  const existedTenant = await tenantsRepository.findTenantById(body._id);
  if (!existedTenant) {
    throw new Error('Tenant does not exist.');
  }
  return await tenantsRepository.updateFields(body);
}

const checkDomainExists = async (query: any): Promise<any> => {
  if(!query.domain) {
    throw new Error('Missing domain name.');
  }
  if (!query._id) {
    throw new Error("Missing tenant id");
  }
  const exists = await tenantsRepository.checkDomainExists(query);
  if(exists) {
    return {
      code : true,
      message : "This domain is already been used."
    }
  } else {
    return {
      code : false,
      message : "This domain has not been taken yet."
    }
  }
}

const getDashboardInfo = async (tenant: string) : Promise<any> => {
  const totalStudents = await usersRepository.countNewestRegisteredStudent(tenant);
  const totalTutors = await usersRepository.countNewestRegisteredTutor(tenant);
  const totalTransactions  = await tuitionsRepository.countNewestTransaction(tenant);
  const upcomingTuitions = await sessionsRepository.findUpcomingTuitionsOfTenant(tenant);
  const canceledTuitions = await tuitionsRepository.findCanceledTuitions(tenant);
  const reportIssuesTuitions = await sessionsRepository.findReportIssueTuitions(tenant);
  return {
    student: totalStudents,
    tutor: totalTutors,
    transaction: totalTransactions,
    upcomingTuitions,
    canceledTuitions,
    reportIssuesTuitions
  }
}

const updateFileList = async (tenant: string, body: any) : Promise<any> => {
  if (!tenant) {
    throw new Error('Tenant ID is missing!');
  }
  if (!body.fileLists || body.fileLists && body.fileLists.length === 0) {
    throw new Error('File list is missing!');
  }
  return await tenantsRepository.updateFileList(tenant, body);
}

const checkFileExist = async (tenant: string, fileId: string): Promise<string> => {
  if (!fileId) {
    throw new Error('File ID cannot be empty.');
  }

  const existedTenant = await tenantsRepository.findTenantById(tenant);
  if (!existedTenant) {
    throw new Error('Partner not found.');
  }

  const fileInfo = existedTenant.fileLists.filter((item: any) => String(item._id) === fileId)[0];
  if (!fileInfo) {
    throw new Error('File not found.');
  }
  try {
    const fsAccessPromise = util.promisify(fs.access);
    await fsAccessPromise(fileInfo.downloadUrl);
  } catch (error) {
    throw new Error('File not found.');
  }

  return fileInfo.downloadUrl;
};

const updateDistributor = async () : Promise<void> => {
  await tenantsRepository.updateDistributor();
}

const exportPartners = async (query?: string) : Promise<any> => {
  var data = await tenantsRepository.findPartners(query);
  let dataExcel = [] as any;
  
  let arrHeaderTitle = [] as any;
  arrHeaderTitle.push('UID');
  arrHeaderTitle.push('Name');
  arrHeaderTitle.push('Domain');
  arrHeaderTitle.push('Registered Company Name');
  arrHeaderTitle.push('Country Of Business');
  arrHeaderTitle.push('Company Registration No.');
  arrHeaderTitle.push('Partner Centre Name');
  arrHeaderTitle.push('Partner Company Registration No.');
  arrHeaderTitle.push('About the center.');
  arrHeaderTitle.push('Main contact person.');
  arrHeaderTitle.push('Main contact number.');
  arrHeaderTitle.push('Main website.');
  arrHeaderTitle.push('Main address.');
  arrHeaderTitle.push('Main billing address.');
  arrHeaderTitle.push('Main email.');
  arrHeaderTitle.push('City.');
  arrHeaderTitle.push('State / Province.');
  arrHeaderTitle.push('Country.');
  arrHeaderTitle.push('ZIP / Portal Code.');
  arrHeaderTitle.push('Time Zone.');
  arrHeaderTitle.push('Primary Currency.');
  arrHeaderTitle.push('Monthly Payment Day.');
  arrHeaderTitle.push('Monthly Payment Amount.');
  arrHeaderTitle.push('Start Date');
  arrHeaderTitle.push('End Date');
  arrHeaderTitle.push('Distributor');
  arrHeaderTitle.push('Is Active');
  arrHeaderTitle.push('Created At');
  dataExcel.push(arrHeaderTitle);

  if (data && data.length) {
    for (let item of data) {
      if (item && item._doc) {
        let rowItemValue = [] as any;
        rowItemValue.push(item._doc._id || "N/A");
        rowItemValue.push(item._doc.name || "N/A");
        rowItemValue.push(('https://' + item._doc.domain + config.nextjs.tailUrl) || "N/A");

        const regCompanyName = item._doc.companyProfile ? item._doc.companyProfile.registeredCompanyName || "N/A" : "N/A"
        rowItemValue.push(regCompanyName || "N/A");
        const countryOfBusiness = item._doc.companyProfile ? item._doc.companyProfile.countryOfRegistration || "N/A" : "N/A"
        rowItemValue.push(countryOfBusiness || "N/A");
        const companyRegNo = item._doc.companyProfile ? item._doc.companyProfile.companyRegistrationNumber || "N/A" : "N/A"
        rowItemValue.push(companyRegNo || "N/A");
        const partnerName = item._doc.companyProfile ? item._doc.companyProfile.partnerCenterName || "N/A" : "N/A"
        rowItemValue.push(partnerName || "N/A");
        const partnerNo = item._doc.companyProfile ? item._doc.companyProfile.partnerCompanyRegistrationNumber || "N/A" : "N/A"
        rowItemValue.push(partnerNo || "N/A");
        const aboutCompany = item._doc.companyProfile ? item._doc.companyProfile.aboutCompany || "N/A" : "N/A";
        rowItemValue.push(aboutCompany || "N/A");
        const mainContactPerson = item._doc.contactInformation ? ((item._doc.contactInformation.gender || "") + " " + item._doc.contactInformation.name || "") : ( item._doc.adminFirstName + ' ' + item._doc.adminLastName );
        rowItemValue.push(mainContactPerson || "N/A");
        const mainContactNumber = item._doc.contactInformation ? (item._doc.contactInformation.contactNumber ? (item._doc.contactInformation.contactNumber.phoneID + item._doc.contactInformation.contactNumber.number) : ( item._doc.adminPhoneID + ' ' + item._doc.adminPhoneNumber )) : ( item._doc.adminPhoneID + ' ' + item._doc.adminPhoneNumber );
        rowItemValue.push(mainContactNumber || "N/A");
        const mainContactWebsite = item._doc.contactInformation ? item._doc.contactInformation.website || "N/A" : "N/A";
        rowItemValue.push(mainContactWebsite || "N/A");
        const mainContactAddress = item._doc.contactInformation ? item._doc.contactInformation.address || "N/A" : "N/A";
        rowItemValue.push(mainContactAddress || "N/A");
        const mainContactBillingAddress = item._doc.contactInformation ? item._doc.contactInformation.billing ? item._doc.contactInformation.billing.address || "N/A" : "N/A" : "N/A";
        rowItemValue.push(mainContactBillingAddress || "N/A");
        const mainContactEmail = item._doc.contactInformation ? item._doc.contactInformation.email || "N/A" : "N/A";
        rowItemValue.push(mainContactEmail || "N/A");
        const city = item._doc.contactInformation ? item._doc.contactInformation.city || "N/A" : "N/A";
        rowItemValue.push(city || "N/A");
        const state = item._doc.contactInformation ? item._doc.contactInformation.state || "N/A" : "N/A";
        rowItemValue.push(state || "N/A");
        const country = item._doc.contactInformation ? item._doc.contactInformation.country || "N/A" : "N/A";
        rowItemValue.push(country || "N/A");
        const zipCode = item._doc.contactInformation ? item._doc.contactInformation.zipCode || "N/A" : "N/A";
        rowItemValue.push(zipCode || "N/A");
        const timeZone = item._doc.otherConfigs ? item._doc.otherConfigs.timeZone ? (item._doc.otherConfigs.timeZone.gmt + " " + item._doc.otherConfigs.timeZone.name) : "N/A" : "N/A";
        rowItemValue.push(timeZone || "N/A");
        const currency = item._doc.otherConfigs ? item._doc.otherConfigs.primaryCurrency ? item._doc.otherConfigs.primaryCurrency.name || "N/A" : "N/A" : "N/A";
        rowItemValue.push(currency || "N/A");
        const monthlyPaymentDay = item._doc.paymentInfo ? item._doc.paymentInfo.dayInMonth || "N/A" : "N/A";
        rowItemValue.push(monthlyPaymentDay || "N/A");
        const monthlyPaymentAmount = item._doc.paymentInfo ? item._doc.paymentInfo.fixedAmount || "N/A" : "N/A";
        rowItemValue.push(monthlyPaymentAmount || "N/A");
        const startDate = item._doc.companyProfile ? (item._doc.companyProfile.partnerShipStartDate ? new Date(item._doc.companyProfile.partnerShipStartDate).toDateString() : "N/A") : "N/A"
        rowItemValue.push(startDate || "N/A");
        const endDate = item._doc.companyProfile ? (item._doc.companyProfile.partnerShipEndDate ? new Date(item._doc.companyProfile.partnerShipEndDate).toDateString() : "N/A") : "N/A"
        rowItemValue.push(endDate || "N/A");
        const distributor = item._doc.adminCreated ? item._doc.adminCreated.distributorInfo ? item._doc.adminCreated.distributorInfo.companyName : item._doc.adminCreated.fullName : "Skyace";
        rowItemValue.push(distributor || "N/A");
        
        rowItemValue.push(item._doc.isActive || "N/A");
        const createdAt = item._doc.createdAt ? item._doc.createdAt.toDateString() : "N/A"
        rowItemValue.push(createdAt || "N/A");
        dataExcel.push(rowItemValue);
      }
    }
  }

  let buffer = nodeXlsx.build([{name: "List Partners", data: dataExcel}])
  return buffer;
}

const getPartnerPayments = async (_id: string): Promise<any> => {
  return await tenantsRepository.getPartnerPayments(_id);
}

const updatePartnerPaycheck = async (query: any): Promise<void> => {
  await tenantsRepository.updatePartnerPaycheck(query._id , query.date);
}

const getPartnerPaycheck = async (_id: string): Promise<any> => {
  return await tenantsRepository.getPartnerPaycheck(_id);
}

export default {
  findTenants,
  findTenantById,
  createTenant,
  updateTenant,
  activateTenant,
  deactivateTenant,
  updateCompanyProfile,
  updateAdminInfo,
  updateConfiguration,
  updateBankTransfer,
  updateContracInfo,
  updatePaypal,
  findTenantByName,
  updateFields,
  checkDomainExists,
  findTenantByDomain,
  findActiveTenantByDomain,
  updateCommissionFee,
  getDashboardInfo,
  updateFileList,
  checkFileExist,
  findTenantsByAdmin,
  updateDistributor,
  exportPartners,
  getPartnerPayments,
  updatePartnerPaycheck,
  getPartnerPaycheck
};
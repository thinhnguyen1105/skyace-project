import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { ITenant } from './interface';

const TenantsSchema = new mongoose.Schema(addAuditSchema(addActiveSchema({
  name: String,
  companyLogoSrc: String,
  domain: String,
  paymentMethod: String,
  adminEmail: String,
  adminFirstName: String,
  adminLastName: String,
  adminPhoneNumber: String,
  adminPhoneID: String,
  companyProfile: {
    registeredCompanyName: String,
    companyRegistrationNumber: String,
    partnerCenterName: String,
    countryOfRegistration: String,
    aboutCompany: String,
    partnerCompanyRegistrationNumber: String,
    regNoSameAsCompany: Boolean,
    partnerCenterNameSameAsCompany: Boolean,
    partnerShipStartDate: String,
    partnerShipEndDate: String
  },
  administrationInfomation: {
    adminName: String,
    adminEmail: String,
  },
  contactInformation: {
    country: String,
    state: String,
    city: String,
    zipCode: String,
    contactNumber: {
      number: String,
      phoneID: String,
    },
    email: String,
    website: String,
    address: String,
    billing: {
      address: String,
      country: String,
      state: String,
      city: String,
      zipCode: String,
      sameAsMain: Boolean
    },
    name: String,
    firstName: String,
    lasName: String,
    gender: String
  },
  bankTransfer: {
    bankName: String,
    bankAccount: String,
    transferDescription: String,
  },
  paypal: {
    paypalID: String,
  },
  otherConfigs: {
    timeZone: Object,
    primaryCurrency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
  },
  commissionFee: {
    firstPayment: Number,
    nextPayment: Number
  },
  paymentInfo: {
    fixedAmount: Number,
    dayInMonth: Number,
  },
  fileLists: Array,
  adminCreated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  assignDistributorTime: Date,
  partnerPaycheck: [{
    type: String
  }]
})), { timestamps: true });
const TenantsModel = mongoose.model<ITenant>('Tenant', TenantsSchema);

export { TenantsSchema };

export default TenantsModel;
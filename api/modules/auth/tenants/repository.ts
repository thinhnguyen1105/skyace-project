import TenantsModel from './mongoose';
import { IFindTenantsQuery, IFindTenantsResult, IFindTenantDetail, ICreateTenantInput, IUpdateTenantInput, IActivateTenant, ICompanyProfile, IAdminInfor, IConfiguration, IContractInfo, IBankTransfer, IPaypal, ICommissionFee, IFindTenantsByAdminQuery } from './interface';
import UsersModel from '../users/mongoose';

const addQuery = (query: IFindTenantsQuery): any => {
  return TenantsModel.find({
    $and: [
      query.search ? { name: { $regex: `^${query.search}`, $options: 'i' } } : {},
      query.isActive ? { isActive: query.isActive } : {},
    ]
  });
};

const addQueryWithAdmin = (query: IFindTenantsByAdminQuery): any => {
  return TenantsModel.find({
    $and: [
      { adminCreated: query.adminCreated},
      query.search ? { name: { $regex: `^${query.search}`, $options: 'i' } } : {},
      query.isActive ? { isActive: query.isActive } : {},
    ]
  });
};

const findTenants = async (query: IFindTenantsQuery): Promise<IFindTenantsResult> => {
  try {
    // Exec query
    const totalPromise = addQuery(query)
      .countDocuments()
      .exec();

    if(query.sortBy) {
      if (query.sortBy === 'adminCreated') {
        var total = await totalPromise;
        var data = await addQuery(query)
        .populate({
          path: 'adminCreated', 
          select: 'roles fullName _id distributorInfo',
        })
        .exec();

        data = data.sort((a, b) => {
          const sortFieldA = a.adminCreated
          ? (a.adminCreated.roles && a.adminCreated.roles[0] === 'sysadmin' ? 'Skyace' : a.adminCreated.distributorInfo ? a.adminCreated.distributorInfo.companyName : a.adminCreated.fullName)
          : 'Skyace';
          const sortFieldB = b.adminCreated
          ? (b.adminCreated.roles && b.adminCreated.roles[0] === 'sysadmin' ? 'Skyace' : b.adminCreated.distributorInfo ? b.adminCreated.distributorInfo.companyName : b.adminCreated.fullName)
          : 'Skyace';
          return query.asc.toString() === 'true' ? sortFieldA.localeCompare(sortFieldB) : sortFieldB.localeCompare(sortFieldA); 
        })

        data = data.splice((query.pageNumber - 1) * query.pageSize , query.pageSize);
        
        return {
          total,
          data
        }
      } else {
        var sortObj = {};
        sortObj[query.sortBy] = (query.asc === true || query.asc.toString() as any === 'true') ? 1 : -1;
        var dataPromise = addQuery(query)
        .populate({
          path: 'adminCreated', 
          select: 'roles fullName _id distributorInfo',
        })
        .sort(sortObj)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(Number(query.pageSize))
        .exec();

        const [total, data] = await Promise.all([totalPromise, dataPromise]);

        return {
          total,
          data
        };
      }
    } else {
      var dataPromise = addQuery(query)
      .populate({
        path: 'adminCreated', 
        select: 'roles fullName _id',
      })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .exec();

      const [total, data] = await Promise.all([totalPromise, dataPromise]);

      return {
        total,
        data
      };
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findTenantByName = async (name: string): Promise<IFindTenantDetail> => {
  try {
    const tenant = await TenantsModel.findOne({ name: name }).exec();
    return tenant as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findTenantByDomain = async (domain: string): Promise<IFindTenantDetail> => {
  try {
    const tenant = await TenantsModel.findOne({domain: domain}).exec();
    return tenant as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findActiveTenantByDomain = async (domain: string): Promise<IFindTenantDetail> => {
  try {
    const tenant = await TenantsModel.findOne({domain: domain, isActive: true}).exec();
    return tenant as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findTenantById = async (tenantId: string): Promise<IFindTenantDetail> => {
  try {
    const tenant = await TenantsModel.findOne({ _id: tenantId }).exec();
    return tenant as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findTenantsByAdmin = async (query: IFindTenantsByAdminQuery): Promise<IFindTenantsResult> => {
  try {
    // Exec query
    const totalPromise = addQueryWithAdmin(query)
      .countDocuments()
      .exec();

    if(query.sortBy) {
      if (query.sortBy === 'adminCreated') {
        var total = await totalPromise;
        var data = await addQueryWithAdmin(query)
        .populate({
          path: 'adminCreated', 
          select: 'roles fullName _id distributorInfo',
        })
        .exec();

        data = data.sort((a, b) => {
          const sortFieldA = a.adminCreated
          ? (a.adminCreated.roles && a.adminCreated.roles[0] === 'sysadmin' ? 'Skyace' : a.adminCreated.distributorInfo ? a.adminCreated.distributorInfo.companyName : a.adminCreated.fullName)
          : 'Skyace';
          const sortFieldB = b.adminCreated
          ? (b.adminCreated.roles && b.adminCreated.roles[0] === 'sysadmin' ? 'Skyace' : b.adminCreated.distributorInfo ? b.adminCreated.distributorInfo.companyName : b.adminCreated.fullName)
          : 'Skyace';
          return query.asc.toString() === 'true' ? sortFieldA.localeCompare(sortFieldB) : sortFieldB.localeCompare(sortFieldA); 
        })

        data = data.splice((query.pageNumber - 1) * query.pageSize , query.pageSize);
        
        return {
          total,
          data
        }
      } else {
        var sortObj = {};
        sortObj[query.sortBy] = (query.asc === true || query.asc.toString() as any === 'true') ? 1 : -1;
        var dataPromise = addQueryWithAdmin(query)
        .populate({
          path: 'adminCreated', 
          select: 'roles fullName _id distributorInfo',
        })
        .sort(sortObj)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(Number(query.pageSize))
        .exec();

        const [total, data] = await Promise.all([totalPromise, dataPromise]);

        return {
          total,
          data
        };
      }
      // sortObj[query.sortBy] = (query.asc === true || query.asc as any === 'true') ? 1 : -1;
    } else {
      const sortObj = {};
      const dataPromise = addQueryWithAdmin(query)
      .populate('adminCreated')
      .sort(sortObj)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .exec();

      const [total, data] = await Promise.all([totalPromise, dataPromise]);

      return {
        total,
        data
      };
    }    
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const createNewTenant = async (body: ICreateTenantInput): Promise<IFindTenantDetail> => {
  try {
    const newTenant = new TenantsModel(body);
    return await newTenant.save();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateTenant = async (body: IUpdateTenantInput): Promise<void> => {
  try {
    await TenantsModel.updateOne({ _id: body._id }, { $set: body }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const activateTenant = async (params: IActivateTenant): Promise<void> => {
  try {
    await TenantsModel.updateOne({ _id: params.tenantId }, { $set: { ...params, isActive: true } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const deactivateTenant = async (params: IActivateTenant): Promise<void> => {
  try {
    await TenantsModel.updateOne({ _id: params.tenantId }, { $set: { ...params, isActive: false } }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update company's profile of tenant */
const updateCompanyProfile = async (body: ICompanyProfile): Promise<void> => {
  try {
    const updateProfileData ={
      companyProfile: body
    }
    await TenantsModel.updateOne(
      { _id: body._id },
      {
        $set: updateProfileData
      }
    ).exec();
  } catch (error) {

    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCompanyProfileWithName = async (body: ICompanyProfile): Promise<void> => {
  try {
    const updateProfileData = body.partnerCenterName ? {
      companyProfile: body,
      name: body.partnerCenterName.toLowerCase().replace(/\s/g, "")
    } : {
      companyProfile: body
    }
    await TenantsModel.updateOne(
      { _id: body._id },
      {
        $set: updateProfileData
      }
    ).exec();
  } catch (error) {

    throw new Error(error.message || 'Internal server error.');
  }
}

/** update admin's info of tenant */
const updateAdminInfor = async (body: IAdminInfor): Promise<void> => {
  try {
    await TenantsModel.updateOne(
      {
        _id: body._id
      },
      {
        $set: {
          administrationInfomation: body
        }
      }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update tenant's configuration */
const updateConfiguration = async (body: IConfiguration): Promise<void> => {
  try {
    await TenantsModel.updateOne(
      {
        _id: body._id
      },
      {
        $set: {
          otherConfigs: body
        }
      }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update tenant's contract */
const updateContractInfo = async (body: IContractInfo): Promise<void> => {
  try {
    await TenantsModel.updateOne(
      {
        _id: body._id
      },
      {
        $set: {
          contactInformation: body
        }
      }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update tenant's bank transfer */
const updateBankTransfer = async (body: IBankTransfer): Promise<void> => {
  try {
    await TenantsModel.updateOne(
      {
        _id: body._id
      },
      {
        $set: {
          bankTransfer: body
        }
    }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update tenant's paypal */
const updatePaypal = async (body: IPaypal): Promise<void> => {
  try {
    await TenantsModel.updateOne(
      {
        _id: body._id
      },
      {
        $set: {
          paypal: body
        }
    }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const updateCommissionFee = async (body: ICommissionFee): Promise<any> => {
  try {
    await TenantsModel.findOneAndUpdate({
      _id: body._id,
    }, 
    {
      $set : {
        commissionFee: body
      }
    }, {
      new: true
    }).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateFields = async (body: any): Promise<any> => {
  try {
    return await TenantsModel.findOneAndUpdate({
      _id: body._id
    }, {
      $set : body
    }, {
      new: true
    }).populate('adminCreated').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const checkDomainExists = async (query: any): Promise<boolean> => {
  try {
    const domainExisted = await TenantsModel.findOne({domain: query.domain, _id: {$ne : query._id}}).exec();
    if (domainExisted) {
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateFileList = async (tenant, body: any): Promise<any> => {
  try {
    const result = await TenantsModel.findOneAndUpdate({ _id: tenant }, { $push: { fileLists: { $each: body.fileLists.map((item) => ({ ...item, uploadDate: new Date() })) } } }, { new: true }).exec();
    if (result ){
      return result.fileLists; 
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateDistributor = async (): Promise<void> => {
  try {
    const admin = await UsersModel.findOne({roles: 'sysadmin'}).select('_id').exec() as any;
    await TenantsModel.updateMany({adminCreated : null}, {adminCreated : admin._id}).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findPartners = async (admin?: string): Promise<any> => {
  const query = admin ? {
    adminCreated: admin
  } : {}
  return await TenantsModel.find(query).populate('adminCreated').populate('otherConfigs.primaryCurrency').exec();
}

const getPartnerPayments = async (_id: string): Promise<any> => {
  const partner = await TenantsModel.findById(_id).exec();
  if (!partner) throw new Error('Cannot find partner');
  const startCountingDate = new Date(partner.createdAt);
  const end = new Date();
  const fixedAmount = partner.paymentInfo ? partner.paymentInfo.fixedAmount !== undefined ? partner.paymentInfo.fixedAmount : 0 : 0;
  const dayInMonth = partner.paymentInfo ? partner.paymentInfo.dayInMonth : undefined;
  if (dayInMonth && dayInMonth > 0) {
    startCountingDate.setDate(dayInMonth);
  }
  const monthsBetween = end.getMonth() - startCountingDate.getMonth()
  + (12 * (end.getFullYear() - startCountingDate.getFullYear()));
  const initialArray = Array.apply(null, {length: monthsBetween} as any).map(Number.call, Number);
  const result = initialArray.map((_val, index) => {
    let initialStart = new Date(startCountingDate);
    let initialEnd = new Date(startCountingDate);
    initialStart.setMonth(initialStart.getMonth() + index);
    initialEnd.setMonth(initialEnd.getMonth() + index + 1);
    return {
      startDate: initialStart,
      endDate: initialEnd,
      total: fixedAmount
    }
  })
  return result;
}

const updatePartnerPaycheck = async (_id: string, date: string): Promise<void> => {
  const record = await TenantsModel.findById(_id).select('partnerPaycheck').exec();
  if (!record) throw new Error('Cannot find record');
  if (record.partnerPaycheck.indexOf(date) >= 0) {
    await TenantsModel.updateOne({_id: _id}, {$pull : {partnerPaycheck : date}}).exec();
  } else {
    await TenantsModel.updateOne({_id: _id}, {$push : {partnerPaycheck : date}}).exec();
  }
}

const getPartnerPaycheck = async (_id: string): Promise<any> => {
  const record = await TenantsModel.findById(_id).select('partnerPaycheck').exec();
  if (!record) throw new Error('Cannot find record');
  return record.partnerPaycheck || [];
}

export {
  findTenants,
  findTenantByName,
  findTenantById,
  createNewTenant,
  updateTenant,
  activateTenant,
  deactivateTenant,
  updateCompanyProfile,
  updateAdminInfor,
  updateConfiguration,
  updateContractInfo,
  updateBankTransfer,
  updatePaypal,
  updateFields,
  checkDomainExists,
  findTenantByDomain,
  updateCompanyProfileWithName,
  findActiveTenantByDomain,
  updateCommissionFee,
  updateFileList,
  findTenantsByAdmin,
  updateDistributor,
  findPartners,
  getPartnerPayments,
  updatePartnerPaycheck,
  getPartnerPaycheck
};
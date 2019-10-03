import TenantsModel from '../../modules/auth/tenants/mongoose';
import config from '../../config';

const checkTenant = () => {
  return async (req, res, next) => {
    const urlRegex = config.nextjs.checkUrlRegex;
    const matchResult =  req.headers.origin ? req.headers.origin.match(urlRegex) : '';

    if (matchResult && matchResult[1]) {
      const existedTenant = await TenantsModel.findOne({$and: [{domain: matchResult[1].replace('.', '')}, {isActive: true}]}).exec();
      if (existedTenant) {
        req.tenant = existedTenant;
        next();
      } else {
        res.status(404).end('URL not found');
      }
    } else {
      const adminTenant = await TenantsModel.findOne({name: 'admin'}).exec();
      req.tenant = adminTenant;
      next();
    }
  };
};

export default checkTenant;
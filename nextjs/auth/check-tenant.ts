import config from '../../api/config';
import logger from '../../api/core/logger/log4js';
import tenantsService from '../../api/modules/auth/tenants/service';
import inputLookupService from '../../api/modules/host/input-lookup/service';

const CheckTenant = () => {
  return async (req, res, next) => {
    const urlRegex = config.nextjs.checkUrlRegexFrontEnd;

    try {
      const matchResult = req.get('host').match(urlRegex);

      if (matchResult && matchResult[1]) {
        const existedTenant = await tenantsService.findActiveTenantByDomain(matchResult[1].replace('.', ''));
        if (existedTenant) {
          const dataLookup = await inputLookupService.find(existedTenant._id);
          req.query.dataLookup = dataLookup;
          req.tenant = existedTenant;
          next();
          return;
        } else {
          res.redirect('/error');
        }
      } else {
        const adminTenant = await tenantsService.findTenantByName('admin');
        const dataLookup = await inputLookupService.find(adminTenant._id);
        req.query.dataLookup = dataLookup;
        req.tenant = adminTenant;
      }

      next();
      return;
    } catch (error) {
      logger.error(error);
      res.redirect('/error');
    }
  };
};

export default CheckTenant;
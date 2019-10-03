import defaultConfig from './default.config';
import usersModuleConfig from './modules/users.config';
import tenantsModuleConfig from './modules/tenants.config';
import developmentConfig from './development.config';
import productionConfig from './production.config';
import * as _ from 'lodash';

const environmentConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
const config = _.merge({}, defaultConfig, usersModuleConfig, tenantsModuleConfig, environmentConfig);
export default config;

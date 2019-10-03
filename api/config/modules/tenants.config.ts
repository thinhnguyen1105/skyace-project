const tenantsModuleConfig = {
  tenantsModuleConfig: {
    domainNameRegex: /^(?=.*[a-z0-9-])[a-z0-9-\d]{3,}$/,
    tenantNameRegex: /^(?=.*[a-zA-Z0-9-\s])[a-zA-Z0-9-\s\d]{3,}$/,
  },
};

export default tenantsModuleConfig;
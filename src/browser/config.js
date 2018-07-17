const _configDefaults = {
  interceptConsole: true,
  addGlobals: true,
  autoUse: true
};

const _config = {..._configDefaults, ...window.PEEK42_CONFIG};

export default _config;

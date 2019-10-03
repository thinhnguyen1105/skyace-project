import React from 'react';
import { connect, Provider } from 'react-redux';
const __NEXT_REMATCH_STORE__ = '__NEXT_REMATCH_STORE__';
import { english } from '../data_common/default-language';
import { getLanguageService } from '../service-proxies';

// https://github.com/iliakan/detect-node
const checkServer = () => Object.prototype.toString.call(global.process) === '[object process]';

const getOrCreateStore = (initStore, initialState) => {
  // Always make a new store if server
  if (checkServer() || typeof window === 'undefined') {
    return initStore(initialState);
  }

  // Memoize store in global variable if client
  if (!window[__NEXT_REMATCH_STORE__]) {
    window[__NEXT_REMATCH_STORE__] = initStore(initialState);
  }
  return window[__NEXT_REMATCH_STORE__];
};

export default (...args) => Component => {
  // First argument is initStore, the rest are redux connect arguments and get passed
  const [initStore, ...connectArgs] = args;

  const ComponentWithRematch = (props: any = {}) => {
    const { store, initialProps, initialState } = props;

    // Connect page to redux with connect arguments
    const ConnectedComponent = connect.apply(null, connectArgs)(Component);

    // Wrap with redux Provider with store
    // Create connected page with initialProps
    return React.createElement(
      Provider,
      {
        store:
          store && store.dispatch
            ? store
            : getOrCreateStore(initStore, initialState)
      },
      React.createElement(ConnectedComponent, initialProps)
    );
  };

  (ComponentWithRematch as any).getInitialProps = async (props: any) => {
    const isServer = checkServer();
    let language;
    try {
      const fetchedLanguage = await getLanguageService().findByShortName(props && props.query && props.query.profile && props.query.profile.lang ? props.query.profile.lang : 'en');
      if (fetchedLanguage && fetchedLanguage.data) {
        language = fetchedLanguage.data
      } else {
        language = english  
      }
    } catch (error) {
      language = english
    }

    const store = getOrCreateStore(initStore, {
      dataLookupModel: props.query.dataLookup,
      profileModel: props.query.profile ? {
        ...props.query.profile,
        isLoggedIn: true,
        updateSocialInfo: {
          email: props.query.profile.email,
          roles: props.query.profile.roles,
          firstName: props.query.profile.firstName,
          lastName: props.query.profile.lastName,
          phone: props.query.profile.phone ? props.query.profile.phone : {},
        },
      } : {},
      languageModel: language,
    });

    // Run page getInitialProps with store and isServer
    const initialProps = Component.getInitialProps
      ? await Component.getInitialProps({ ...props, isServer, store })
      : {};

    return {
      store,
      initialState: store.getState(),
      initialProps
    };
  };

  return ComponentWithRematch;
};

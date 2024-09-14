import Cookies from 'js-cookie';

const useSuapClient = (authHost, clientID, redirectURI, scope) => {
  const resourceURL = `${authHost}/api/eu/`;
  const authorizationURL = `${authHost}/o/authorize/`;
  const logoutURL = `${authHost}/o/revoke_token/`;

  const responseType = 'token';

  const extractToken = () => {
    const match = window.location.hash.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  };

  const extractScope = () => {
    const match = window.location.hash.match(/scope=([^&]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  };

  const extractDuration = () => {
    const match = window.location.hash.match(/expires_in=(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  const clearUrl = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const initToken = () => {
    const tokenValue = extractToken();
    const expirationTime = extractDuration();
    const scope = extractScope();

    if (tokenValue) {
      Cookies.set('suapToken', tokenValue, { expires: expirationTime });
      Cookies.set('suapScope', scope, { expires: expirationTime });

      clearUrl();
    }

    return {
      tokenValue,
      expirationTime,
      scope,
    };
  };

  const isAuthenticated = () => {
    return !!Cookies.get('suapToken');
  };

  const login = () => {
    const loginUrl = `${authorizationURL}?response_type=${responseType}&client_id=${clientID}&scope=${scope}&redirect_uri=${redirectURI}`;
    window.location.href = loginUrl;
  };

  const logout = () => {
    fetch(logoutURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: Cookies.get('suapToken'),
        client_id: clientID,
      }),
    })
      .then(() => {
        Cookies.remove('suapToken');
        window.location.href = redirectURI;
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error);
      });
  };

  const getResource = (callback) => {
    fetch(resourceURL, {
      headers: {
        Authorization: `Bearer ${Cookies.get('suapToken')}`,
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      })
      .catch((error) => {
        console.error('Erro ao obter recursos:', error);
        logout();
      });
  };

  return {
    initToken,
    isAuthenticated,
    login,
    logout,
    getResource,
  };
};

export default useSuapClient;

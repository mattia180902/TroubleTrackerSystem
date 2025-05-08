export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8081/auth',
    realm: 'ticketing',
    clientId: 'ticketing-frontend'
  }
};
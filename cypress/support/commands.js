// ***********************************************
// Commandes personnalisées Tripiz Admin E2E
// ***********************************************

const API = 'https://tripiz-api-production-d0f2.up.railway.app';

/**
 * cy.login(email, password)
 * Se connecte via l'UI en mockant l'appel API /auth/login.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.fixture('auth').then((auth) => {
    cy.intercept('POST', `${API}/auth/login`, {
      statusCode: 200,
      body: auth.loginResponse,
    }).as('loginRequest');

    cy.visit('/');
    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.contains('button', 'Se connecter').click();
    cy.wait('@loginRequest');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.not.be.null;
      expect(win.localStorage.getItem('refreshToken')).to.not.be.null;
    });
  });
});

/**
 * cy.loginByLocalStorage()
 * Injecte directement les tokens dans le localStorage (plus rapide).
 */
Cypress.Commands.add('loginByLocalStorage', () => {
  cy.fixture('auth').then((auth) => {
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', auth.loginResponse.accessToken);
      win.localStorage.setItem('refreshToken', auth.loginResponse.refreshToken);
    });
  });
});

/**
 * cy.logout()
 * Vide le localStorage et retourne à la page de connexion.
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('authToken');
    win.localStorage.removeItem('refreshToken');
  });
  cy.visit('/');
});

/**
 * cy.mockAllApis()
 * Intercepte toutes les routes API réelles avec des réponses mockes.
 * Les endpoints correspondent exactement aux Services/*.js du projet.
 */
Cypress.Commands.add('mockAllApis', () => {
  cy.intercept('GET', `${API}/user/admin/users`,              { statusCode: 200, body: [] }).as('getUsers');
  cy.intercept('GET', `${API}/user/admin/drivers`,            { statusCode: 200, body: [] }).as('getDrivers');
  cy.intercept('GET', `${API}/user/admin/countTotalUsers`,    { statusCode: 200, body: { count: 0 } }).as('countTotal');
  cy.intercept('GET', `${API}/user/admin/countOnline`,        { statusCode: 200, body: { count: 0 } }).as('countOnline');
  cy.intercept('GET', `${API}/user/admin/countBlocked`,       { statusCode: 200, body: { count: 0 } }).as('countBlocked');
  cy.intercept('GET', `${API}/user/admin/countCreatedThisMonth`, { statusCode: 200, body: { count: 0 } }).as('countMonth');

  cy.intercept('GET', `${API}/bus/admin/buses`,               { statusCode: 200, body: [] }).as('getBuses');
  cy.intercept('GET', `${API}/bus/admin/countInServiceBus`,   { statusCode: 200, body: { count: 0 } }).as('countInService');
  cy.intercept('GET', `${API}/bus/admin/countInMaintenanceBus`,{ statusCode: 200, body: { count: 0 } }).as('countMaintenance');
  cy.intercept('GET', `${API}/bus/admin/totalCapacity`,       { statusCode: 200, body: { capacity: 0 } }).as('totalCapacity');

  cy.intercept('GET', `${API}/trip/admin/getAll`,             { statusCode: 200, body: [] }).as('getTrips');
  cy.intercept('GET', `${API}/trip/admin/countAllTrips`,      { statusCode: 200, body: { count: 0 } }).as('countTrips');
  cy.intercept('GET', `${API}/trip/admin/countAllPassengers`, { statusCode: 200, body: { count: 0 } }).as('countPassengers');
  cy.intercept('GET', `${API}/trip/admin/getStatistics`,      { statusCode: 200, body: {} }).as('getStats');

  cy.intercept('GET', `${API}/ticket/admin/list`,             { statusCode: 200, body: [] }).as('getTickets');

  cy.intercept('GET', `${API}/itinerary/**`,                  { statusCode: 200, body: [] }).as('getItineraries');
  cy.intercept('GET', `${API}/station/**`,                    { statusCode: 200, body: [] }).as('getStations');

  cy.intercept('GET', `${API}/health`,                        { statusCode: 200, body: { status: 'ok' } }).as('health');
});
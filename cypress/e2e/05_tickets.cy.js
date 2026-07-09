const API = 'https://tripiz-api-production-d0f2.up.railway.app';

const MOCK_TICKETS = [
  {
    ticketId: 'tkt_001',
    userId: 'usr_001',
    tripId: 'trip_001',
    purchaseDate: '2026-07-10T08:00:00Z',
    expirationDate: '2026-07-15T08:00:00Z',
    status: 'VALIDE',
    price: 5000,
    paymentMethod: 'Orange Money'
  },
  {
    ticketId: 'tkt_002',
    userId: 'usr_002',
    tripId: 'trip_002',
    purchaseDate: '2026-07-11T06:30:00Z',
    expirationDate: '2026-07-16T06:30:00Z',
    status: 'UTILISE',
    price: 3500,
    paymentMethod: 'MTN Mobile Money'
  },
];

const MOCK_USERS = [
  { user_id: 'usr_001', firstName: 'Marie', lastName: 'Dupont', email: 'marie@test.com' },
  { user_id: 'usr_002', firstName: 'Paul', lastName: 'Nkemdirim', email: 'paul@test.com' }
];

describe('Gestion des Billets', () => {

  beforeEach(() => {
    cy.loginByLocalStorage();
    cy.intercept('GET', `${API}/health*`, { statusCode: 200 }).as('health');
    cy.intercept('GET', `${API}/ticket/admin/list`, { statusCode: 200, body: MOCK_TICKETS }).as('getTickets');
    cy.intercept('GET', `${API}/user/admin/users`, { statusCode: 200, body: MOCK_USERS }).as('getUsers');
    cy.intercept('GET', `${API}/trip/admin/getAll`, { statusCode: 200, body: [] }).as('getTrips');
    cy.intercept('GET', `${API}/itinerary/**`, { statusCode: 200, body: [] }).as('getItineraries');
  });

  describe('Page Billets — Affichage', () => {
    it('charge la page /tickets sans erreur', () => {
      cy.visit('/tickets');
      cy.url().should('include', '/tickets');
    });

    it('affiche la sidebar sur la page des billets', () => {
      cy.visit('/tickets');
      cy.get('nav').should('be.visible');
    });
  });

  describe('Liste des billets', () => {
    it('affiche les billets dans le tableau avec le nom résolu de l\'utilisateur', () => {
      cy.visit('/tickets');
      cy.wait(['@getTickets', '@getUsers']);
      cy.contains('Marie Dupont').should('be.visible');
    });

    it('affiche le statut résolu des billets', () => {
      cy.visit('/tickets');
      cy.wait(['@getTickets', '@getUsers']);
      cy.contains('Valide').should('be.visible');
      cy.contains('Utilisé').should('be.visible');
    });
  });

  describe('Recherche de billets', () => {
    it('filtre les billets par nom du passager', () => {
      cy.visit('/tickets');
      cy.wait(['@getTickets', '@getUsers']);
      cy.get('input[placeholder*="Rechercher par utilisateur, trajet ou ID…"]').type('Marie');
      cy.contains('Marie Dupont').should('be.visible');
      cy.contains('Paul Nkemdirim').should('not.exist');
    });
  });

});

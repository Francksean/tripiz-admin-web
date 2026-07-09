const API = 'https://tripiz-api-production-d0f2.up.railway.app';

describe('Gestion des Bus', () => {

  beforeEach(() => {
    cy.loginByLocalStorage();
    cy.intercept('GET', `${API}/health*`, { statusCode: 200 }).as('health');
  });

  const mockBusesApis = (buses = []) => {
    cy.intercept('GET', `${API}/bus/admin/buses`,               { statusCode: 200, body: buses }).as('getBuses');
    cy.intercept('GET', `${API}/bus/admin/countInServiceBus`,   { statusCode: 200, body: { count: buses.filter(b => b.status === 'En service').length } }).as('countInService');
    cy.intercept('GET', `${API}/bus/admin/countInMaintenanceBus`,{ statusCode: 200, body: { count: buses.filter(b => b.status === 'En maintenance').length } }).as('countMaintenance');
    cy.intercept('GET', `${API}/bus/admin/totalCapacity`,       { statusCode: 200, body: { capacity: buses.reduce((acc, b) => acc + b.capacity, 0) } }).as('totalCapacity');
    
    // Autres mocks secondaires
    cy.intercept('GET', `${API}/station/admin/list`,            { statusCode: 200, body: [] }).as('getStations');
    cy.intercept('GET', `${API}/user/admin/users`,              { statusCode: 200, body: [] }).as('getUsers');
  };


  describe('Page Bus — Affichage', () => {
    it('charge et affiche la page /buses sans erreur', () => {
      mockBusesApis([]);
      cy.visit('/buses');
      cy.url().should('include', '/buses');
    });

    it('affiche la sidebar sur la page des bus', () => {
      mockBusesApis([]);
      cy.visit('/buses');
      cy.get('nav').should('be.visible');
    });
  });


  describe('Liste des bus', () => {
    it('affiche les bus dans la liste', () => {
      cy.fixture('buses').then((buses) => {
        mockBusesApis(buses);
        cy.visit('/buses');
        cy.wait('@getBuses');
        cy.contains(buses[0].busNumber).should('be.visible');
        cy.contains(buses[1].busNumber).should('be.visible');
      });
    });

    it('affiche l\'immatriculation de chaque bus', () => {
      cy.fixture('buses').then((buses) => {
        mockBusesApis(buses);
        cy.visit('/buses');
        cy.wait('@getBuses');
        buses.forEach((bus) => {
          cy.contains(bus.matriculation).should('be.visible');
        });
      });
    });

    it('affiche la liste vide si aucun bus disponible', () => {
      mockBusesApis([]);
      cy.visit('/buses');
      cy.wait('@getBuses');
      cy.contains('Aucun bus trouvé').should('be.visible');
    });
  });

  // ── Création d'un bus ───────────────────────────────────

  describe('Ajout d\'un bus', () => {
    it('affiche un bouton pour ajouter un bus', () => {
      mockBusesApis([]);
      cy.visit('/buses');
      cy.wait('@getBuses');
      cy.contains('button', 'Nouveau Bus').should('be.visible');
    });

    it('ouvre un formulaire / modal en cliquant sur le bouton d\'ajout', () => {
      mockBusesApis([]);
      cy.visit('/buses');
      cy.wait('@getBuses');
      cy.contains('button', 'Nouveau Bus').click();
      cy.contains('h2', 'Nouveau bus').should('be.visible');
    });

    it('crée un nouveau bus et met à jour la liste', () => {
      const newBus = {
        id: 'bus_new',
        busNumber: 3,
        matriculation: 'LT 9999 Z',
        capacity: 18,
        status: 'En service',
      };

      cy.intercept('POST', `${API}/bus/createBus`, {
        statusCode: 201,
        body: newBus,
      }).as('createBus');

      cy.fixture('buses').then((buses) => {
        mockBusesApis(buses);
        cy.visit('/buses');
        cy.wait('@getBuses');

        cy.contains('button', 'Nouveau Bus').click();

        // Remplir les champs en se basant sur les labels associés
        cy.contains('label', 'Numéro du bus').parent().find('input').type('3');
        cy.contains('label', 'Immatriculation').parent().find('input').type('LT 9999 Z');
        cy.contains('label', 'Capacité').parent().find('input').type('18');

        // Soumettre
        cy.contains('button', /enregistrer|créer|save/i).click();

        cy.wait('@createBus');
      });
    });
  });

  // ── Suppression d'un bus ────────────────────────────────

  describe('Suppression d\'un bus', () => {
    it('demande confirmation avant la suppression', () => {
      cy.fixture('buses').then((buses) => {
        mockBusesApis(buses);
        cy.intercept('DELETE', `${API}/bus/delete/**`, { statusCode: 204 }).as('deleteBus');
        cy.visit('/buses');
        cy.wait('@getBuses');

        cy.on('window:confirm', () => false); // Annuler
        cy.get('button[title*="Supprimer" i], button[aria-label*="Supprimer" i]')
          .first()
          .click();
        
        // Doit rester visible
        cy.contains(buses[0].busNumber).should('be.visible');
      });
    });
  });

});

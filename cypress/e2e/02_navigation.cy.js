describe('Navigation — Sidebar', () => {

  beforeEach(() => {
    // Injecter un token valide et mocker toutes les APIs
    cy.loginByLocalStorage();
    cy.mockAllApis();
  });


  describe('Sidebar — Présence et structure', () => {
    it('affiche la sidebar après connexion', () => {
      cy.visit('/stats');
      cy.get('nav').should('be.visible');
    });

    it('affiche le logo TRIPIZ dans la sidebar', () => {
      cy.visit('/stats');
      cy.contains('TRIPIZ').should('be.visible');
    });

    it('affiche tous les liens de navigation', () => {
      cy.visit('/stats');
      cy.contains('Tableau de bord').should('be.visible');
      cy.contains('Utilisateurs').should('be.visible');
      cy.contains('Bus').should('be.visible');
      cy.contains('Itinéraires').should('be.visible');
      cy.contains('Trajets').should('be.visible');
      cy.contains('Billets').should('be.visible');
    });

    it('affiche la section Administrateur dans la sidebar', () => {
      cy.visit('/stats');
      cy.contains('Administrateur').should('be.visible');
    });
  });


  describe('Navigation entre les pages', () => {
    it('navigue vers /users en cliquant sur "Utilisateurs"', () => {
      cy.visit('/stats');
      cy.contains('Utilisateurs').click();
      cy.url().should('include', '/users');
    });

    it('navigue vers /buses en cliquant sur "Bus"', () => {
      cy.visit('/stats');
      cy.contains('Bus').click();
      cy.url().should('include', '/buses');
    });

    it('navigue vers /routes en cliquant sur "Itinéraires"', () => {
      cy.visit('/stats');
      cy.contains('Itinéraires').click();
      cy.url().should('include', '/routes');
    });

    it('navigue vers /trips en cliquant sur "Trajets"', () => {
      cy.visit('/stats');
      cy.contains('Trajets').click();
      cy.url().should('include', '/trips');
    });

    it('navigue vers /tickets en cliquant sur "Billets"', () => {
      cy.visit('/stats');
      cy.contains('Billets').click();
      cy.url().should('include', '/tickets');
    });

    it('navigue vers /stats en cliquant sur "Tableau de bord"', () => {
      cy.visit('/users');
      cy.contains('Tableau de bord').click();
      cy.url().should('include', '/stats');
    });
  });


  describe('Sidebar — Collapse / Expand', () => {
    it('réduit la sidebar en cliquant sur le bouton de collapse', () => {
      cy.visit('/stats');
      // Le bouton de toggle est le petit rond à droite de la sidebar
      cy.get('button[title="Réduire"]').click();
      // Après collapse, les labels disparaissent
      cy.contains('Utilisateurs').should('not.be.visible');
    });

    it('réexpand la sidebar après réduction', () => {
      cy.visit('/stats');
      cy.get('button[title="Réduire"]').click();
      cy.get('button[title="Déplier"]').click();
      cy.contains('Utilisateurs').should('be.visible');
    });

    it('persiste l\'état collapsed dans le localStorage', () => {
      cy.visit('/stats');
      cy.get('button[title="Réduire"]').click();
      cy.window().its('localStorage').invoke('getItem', 'sidebar-collapsed')
        .should('eq', 'true');
    });
  });


  describe('Accès direct aux URLs (avec token)', () => {
    it('accède directement à /users', () => {
      cy.visit('/users');
      cy.url().should('include', '/users');
    });

    it('accède directement à /buses', () => {
      cy.visit('/buses');
      cy.url().should('include', '/buses');
    });

    it('accède directement à /routes', () => {
      cy.visit('/routes');
      cy.url().should('include', '/routes');
    });

    it('accède directement à /trips', () => {
      cy.visit('/trips');
      cy.url().should('include', '/trips');
    });

    it('accède directement à /tickets', () => {
      cy.visit('/tickets');
      cy.url().should('include', '/tickets');
    });

    it('accède directement à /stats', () => {
      cy.visit('/stats');
      cy.url().should('include', '/stats');
    });
  });

  describe('Titres et en-têtes des pages', () => {
    it('affiche "Gestion des Utilisateurs" sur /users', () => {
      cy.visit('/users');
      cy.contains('Gestion des Utilisateurs').should('be.visible');
    });
  });

});

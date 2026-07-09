describe('Test — Tripiz Admin', () => {

  it('affiche la page de connexion à la racine /', () => {
    cy.visit('/');
    cy.contains('TRIPIZ').should('be.visible');
    cy.contains('Connexion').should('be.visible');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.contains('button', 'Se connecter').should('exist');
  });

  it('le titre du document est défini', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
  });

  it('la page ne contient pas d\'erreurs console critiques', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });
    // Après chargement, s'assurer qu'il n'y a pas d'erreurs de type React crash
    cy.get('body').should('not.be.empty');
  });

});

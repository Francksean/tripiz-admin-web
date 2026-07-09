const API = 'https://tripiz-api-production-d0f2.up.railway.app';

describe('Authentification', () => {

  beforeEach(() => {
    // S'assurer qu'on est déconnecté avant chaque test
    cy.clearLocalStorage();
    cy.visit('/');
  });


  describe('Page de connexion — Affichage', () => {
    it('affiche le logo et le nom TRIPIZ', () => {
      cy.contains('TRIPIZ').should('be.visible');
    });

    it('affiche le titre "Connexion"', () => {
      cy.contains('h3', 'Connexion').should('be.visible');
    });

    it('affiche le champ e-mail avec placeholder', () => {
      cy.get('input[name="email"]')
        .should('be.visible')
        .and('have.attr', 'placeholder', 'admin@tripiz.cm');
    });

    it('affiche le champ mot de passe masqué par défaut', () => {
      cy.get('input[name="password"]')
        .should('be.visible')
        .and('have.attr', 'type', 'password');
    });

    it('affiche le bouton "Se connecter"', () => {
      cy.contains('button', 'Se connecter').should('be.visible');
    });

    it('affiche le bouton AFFICHER / MASQUER le mot de passe', () => {
      cy.contains('button', 'AFFICHER').should('be.visible');
    });
  });


  describe('Formulaire — Interactions', () => {
    it('permet de saisir un e-mail', () => {
      cy.get('input[name="email"]')
        .type('admin@tripiz.cm')
        .should('have.value', 'admin@tripiz.cm');
    });

    it('permet de saisir un mot de passe', () => {
      cy.get('input[name="password"]')
        .type('monmotdepasse')
        .should('have.value', 'monmotdepasse');
    });

    it('affiche le mot de passe en clair après clic sur AFFICHER', () => {
      cy.get('input[name="password"]').type('secret123');
      cy.contains('button', 'AFFICHER').click();
      cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    });

    it('re-masque le mot de passe après clic sur MASQUER', () => {
      cy.get('input[name="password"]').type('secret123');
      cy.contains('button', 'AFFICHER').click();
      cy.contains('button', 'MASQUER').click();
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('permet la soumission avec la touche Entrée', () => {
      cy.intercept('POST', `${API}/auth/login`, { statusCode: 401, body: { message: 'Identifiants incorrects.' } }).as('loginEnter');
      cy.get('input[name="email"]').type('test@tripiz.cm');
      cy.get('input[name="password"]').type('wrongpass{enter}');
      cy.wait('@loginEnter');
    });
  });


  describe('Validation — Champs vides', () => {
    it('affiche une erreur si les deux champs sont vides', () => {
      cy.contains('button', 'Se connecter').click();
      cy.contains('Veuillez remplir tous les champs').should('be.visible');
    });

    it('affiche une erreur si le mot de passe seul est vide', () => {
      cy.get('input[name="email"]').type('admin@tripiz.cm');
      cy.contains('button', 'Se connecter').click();
      cy.contains('Veuillez remplir tous les champs').should('be.visible');
    });

    it('affiche une erreur si l\'e-mail seul est vide', () => {
      cy.get('input[name="password"]').type('monmdp');
      cy.contains('button', 'Se connecter').click();
      cy.contains('Veuillez remplir tous les champs').should('be.visible');
    });
  });


  describe('Connexion échouée', () => {
    it('affiche un message d\'erreur avec des identifiants incorrects', () => {
      cy.intercept('POST', `${API}/auth/login`, {
        statusCode: 401,
        body: { message: 'Identifiants incorrects. Réessayez.' },
      }).as('loginFail');

      cy.get('input[name="email"]').type('faux@tripiz.cm');
      cy.get('input[name="password"]').type('mauvaismdp');
      cy.contains('button', 'Se connecter').click();

      cy.wait('@loginFail');
      cy.contains('Identifiants incorrects').should('be.visible');
    });

    it('efface l\'erreur dès que l\'utilisateur retape dans un champ', () => {
      cy.intercept('POST', `${API}/auth/login`, {
        statusCode: 401,
        body: { message: 'Identifiants incorrects.' },
      }).as('loginFail2');

      cy.get('input[name="email"]').type('faux@tripiz.cm');
      cy.get('input[name="password"]').type('mauvaismdp');
      cy.contains('button', 'Se connecter').click();
      cy.wait('@loginFail2');

      cy.contains('Identifiants incorrects').should('be.visible');
      cy.get('input[name="email"]').type('a');
      cy.contains('Identifiants incorrects').should('not.exist');
    });

    it('affiche un spinner pendant la requête de connexion', () => {
      cy.intercept('POST', `${API}/auth/login`, (req) => {
        req.reply({ delay: 1500, statusCode: 401, body: { message: 'Erreur' } });
      }).as('loginSlow');

      cy.get('input[name="email"]').type('admin@tripiz.cm');
      cy.get('input[name="password"]').type('monmdp');
      cy.contains('button', 'Se connecter').click();

      // Le spinner doit apparaître pendant le chargement
      cy.get('.animate-spin').should('be.visible');
      cy.wait('@loginSlow');
    });
  });


  describe('Connexion réussie', () => {
    it('redirige vers /stats après une connexion valide', () => {
      cy.fixture('auth').then((auth) => {
        cy.intercept('POST', `${API}/auth/login`, {
          statusCode: 200,
          body: auth.loginResponse,
        }).as('loginOk');

        cy.get('input[name="email"]').type(auth.validUser.email);
        cy.get('input[name="password"]').type(auth.validUser.password);
        cy.contains('button', 'Se connecter').click();

        cy.wait('@loginOk');
        cy.url().should('include', '/stats');
      });
    });

    it('stocke l\'accessToken dans le localStorage après connexion', () => {
      cy.fixture('auth').then((auth) => {
        cy.intercept('POST', `${API}/auth/login`, {
          statusCode: 200,
          body: auth.loginResponse,
        }).as('loginToken');

        cy.get('input[name="email"]').type(auth.validUser.email);
        cy.get('input[name="password"]').type(auth.validUser.password);
        cy.contains('button', 'Se connecter').click();

        cy.wait('@loginToken');
        cy.window().its('localStorage').invoke('getItem', 'authToken')
          .should('not.be.null');
      });
    });

    it('stocke le refreshToken dans le localStorage après connexion', () => {
      cy.fixture('auth').then((auth) => {
        cy.intercept('POST', `${API}/auth/login`, {
          statusCode: 200,
          body: auth.loginResponse,
        }).as('loginRefresh');

        cy.get('input[name="email"]').type(auth.validUser.email);
        cy.get('input[name="password"]').type(auth.validUser.password);
        cy.contains('button', 'Se connecter').click();

        cy.wait('@loginRefresh');
        cy.window().its('localStorage').invoke('getItem', 'refreshToken')
          .should('not.be.null');
      });
    });
  });


  describe('Déconnexion', () => {
    beforeEach(() => {
      cy.mockAllApis();
      cy.loginByLocalStorage();
      cy.visit('/stats');
    });

    it('affiche un bouton "Déconnexion" dans la sidebar', () => {
      cy.contains('Déconnexion').should('be.visible');
    });

    it('efface les tokens du localStorage après déconnexion confirmée', () => {
      // Intercepter window.confirm pour confirmer automatiquement
      cy.on('window:confirm', () => true);
      cy.contains('Déconnexion').click();

      cy.window().its('localStorage').invoke('getItem', 'authToken').should('be.null');
      cy.window().its('localStorage').invoke('getItem', 'refreshToken').should('be.null');
    });

    it('redirige vers la page de connexion après déconnexion', () => {
      cy.on('window:confirm', () => true);
      cy.contains('Déconnexion').click();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('annule la déconnexion si l\'utilisateur clique "Annuler"', () => {
      cy.on('window:confirm', () => false);
      cy.contains('Déconnexion').click();
      // L'utilisateur reste sur la même page
      cy.url().should('include', '/stats');
    });
  });

});

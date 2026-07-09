const API = 'https://tripiz-api-production-d0f2.up.railway.app';

// Intercepts correspondant EXACTEMENT aux endpoints de UserService.js
const mockUsersApis = (users = []) => {
  cy.intercept('GET', `${API}/user/admin/users`,                   { statusCode: 200, body: users }).as('getUsers');
  cy.intercept('GET', `${API}/user/admin/drivers`,                 { statusCode: 200, body: [] }).as('getDrivers');
  cy.intercept('GET', `${API}/user/admin/countTotalUsers`,         { statusCode: 200, body: { count: users.length } }).as('countTotal');
  cy.intercept('GET', `${API}/user/admin/countOnline`,             { statusCode: 200, body: { count: users.filter(u => u.status === 'online').length } }).as('countOnline');
  cy.intercept('GET', `${API}/user/admin/countBlocked`,            { statusCode: 200, body: { count: users.filter(u => u.status === 'blocked').length } }).as('countBlocked');
  cy.intercept('GET', `${API}/user/admin/countCreatedThisMonth`,   { statusCode: 200, body: { count: 0 } }).as('countMonth');
  cy.intercept('GET', `${API}/health`,                             { statusCode: 200, body: { status: 'ok' } }).as('health');
};

describe('Gestion des Utilisateurs', () => {

  beforeEach(() => {
    cy.loginByLocalStorage();
  });


  describe('Page Utilisateurs — Affichage', () => {
    it('affiche le titre "Gestion des Utilisateurs"', () => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.contains('Gestion des Utilisateurs').should('be.visible');
    });

    it('affiche le bouton "Nouveau Chauffeur"', () => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.contains('button', 'Nouveau Chauffeur').should('be.visible');
    });

    it('affiche un champ de recherche', () => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.get('input[placeholder*="Rechercher par nom ou email…"]').should('be.visible');
    });

    it('affiche le message "Aucun utilisateur" quand la liste est vide', () => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.wait('@getUsers');
      cy.contains('Aucun utilisateur').should('be.visible');
    });

    it('affiche un bouton "Créer le premier chauffeur" quand la liste est vide', () => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.wait('@getUsers');
      cy.contains('Créer le premier chauffeur').should('be.visible');
    });
  });


  describe('Liste des utilisateurs', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        mockUsersApis(users);
      });
      cy.visit('/users');
      cy.wait('@getUsers');
    });

    it('affiche les utilisateurs dans le tableau', () => {
      cy.fixture('users').then((users) => {
        cy.contains(users[0].firstName).should('be.visible');
        cy.contains(users[1].firstName).should('be.visible');
      });
    });

    it('affiche les emails des utilisateurs', () => {
      cy.fixture('users').then((users) => {
        // L'email dans la colonne "Contact" doit être visible dans la table
        cy.get('table').contains(users[0].email).should('exist');
      });
    });

    it('affiche le nombre total d\'utilisateurs dans les stats', () => {
      cy.fixture('users').then((users) => {
        cy.contains(users.length.toString()).should('be.visible');
      });
    });
  });


  describe('Recherche et filtres', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        mockUsersApis(users);
      });
      cy.visit('/users');
      cy.wait('@getUsers');
    });

    it('filtre les utilisateurs par nom', () => {
      cy.fixture('users').then((users) => {
        const target = users[0].firstName;
        cy.get('input[placeholder*="Rechercher par nom ou email…"]').type(target);
        cy.contains(target).should('be.visible');
        cy.contains(users[1].firstName).should('not.exist');
      });
    });

    it('filtre par email', () => {
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder*="Rechercher par nom ou email…"]').type(users[1].email);
        cy.get('table').contains(users[1].email).should('exist');
        cy.contains(users[0].firstName).should('not.exist');
      });
    });

    it('affiche "Aucun résultat" quand la recherche ne correspond à rien', () => {
      cy.get('input[placeholder*="Rechercher par nom ou email…"]').type('xyzxyzxyz_introuvable');
      cy.contains('Aucun résultat').should('be.visible');
    });

    it('affiche un bouton pour réinitialiser les filtres après une recherche vide', () => {
      cy.get('input[placeholder*="Rechercher par nom ou email…"]').type('introuvable');
      cy.contains('Réinitialiser les filtres').should('be.visible');
    });

    it('réinitialise les filtres et réaffiche tous les utilisateurs', () => {
      cy.fixture('users').then((users) => {
        cy.get('input[placeholder*="Rechercher par nom ou email…"]').type('introuvable');
        cy.contains('Réinitialiser les filtres').click();
        cy.contains(users[0].firstName).should('be.visible');
      });
    });
  });

  describe('Création d\'un chauffeur', () => {
    beforeEach(() => {
      mockUsersApis([]);
      cy.visit('/users');
      cy.wait('@getUsers');
    });

    it('ouvre la modal en cliquant sur "Nouveau Chauffeur"', () => {
      cy.contains('button', 'Nouveau Chauffeur').click();
      cy.contains('h2', 'Nouveau chauffeur').should('be.visible');
    });

    it('ouvre la modal via le bouton "Créer le premier chauffeur"', () => {
      cy.contains('Créer le premier chauffeur').click();
      cy.contains('h2', 'Nouveau chauffeur').should('be.visible');
    });

    it('crée un chauffeur et ferme la modal après soumission réussie', () => {
      const newUser = {
        user_id: 'usr_new',
        firstName: 'NouveauTest',
        lastName: 'Chauffeur',
        email: 'nouveau@tripiz.cm',
        phone: '+237690001234',
        role: 'DRIVER',
        status: 'online',
      };

      cy.intercept('POST', `${API}/auth/register/driver`, {
        statusCode: 201,
        body: newUser,
      }).as('createDriver');

      cy.intercept('GET', `${API}/user/admin/users`, {
        statusCode: 200,
        body: [newUser],
      }).as('getUsersAfterCreate');

      cy.contains('button', 'Nouveau Chauffeur').click();

      // Utiliser des sélecteurs forçant la saisie dans le bon formulaire ou les cibler précisément
      cy.get('form input[placeholder*="socatur.cm"]').type('nouveau@tripiz.cm');
      cy.get('form input[type="password"]').type('Pass1234!');
      cy.get('form input[placeholder="Jean"]').type('NouveauTest');
      cy.get('form input[placeholder="Mballa"]').type('Chauffeur');
      cy.get('form input[placeholder*="+237"]').type('+237690001234');

      cy.get('form').contains('button', 'Créer').click();

      cy.wait('@createDriver');
      cy.contains('h2', 'Nouveau chauffeur').should('not.exist');
    });
  });

  describe('Suppression d\'un utilisateur', () => {
    beforeEach(() => {
      cy.fixture('users').then((users) => {
        mockUsersApis(users);
        cy.intercept('DELETE', `${API}/user/delete/**`, { statusCode: 204 }).as('deleteUser');
      });
      cy.visit('/users');
      cy.wait('@getUsers');
    });

    it('affiche une boîte de confirmation avant la suppression', () => {
      cy.fixture('users').then((users) => {
        cy.on('window:confirm', (text) => {
          expect(text).to.include(users[0].firstName);
          return false;
        });
        cy.get('button[title="Supprimer"]').first().click();
      });
    });

    it('supprime un utilisateur après confirmation', () => {
      cy.fixture('users').then((users) => {
        cy.on('window:confirm', () => true);

        cy.intercept('GET', `${API}/user/admin/users`, {
          statusCode: 200,
          body: users.slice(1),
        }).as('getUsersAfterDelete');

        cy.get('button[title="Supprimer"]').first().click();

        cy.wait('@deleteUser');
        cy.contains(users[0].firstName).should('not.exist');
      });
    });
  });

});

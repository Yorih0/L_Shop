describe('Login page (E2E)', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="login"]').type('admin');
    cy.get('input[name="password"]').type('123321');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
    cy.contains('Profile').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="login"]').type('admin');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.contains('Неверный логин или пароль').should('exist');
  });
});


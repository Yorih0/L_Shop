describe('Register page (E2E)', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register new user and redirect to profile', () => {
    cy.get('input[name="login"]').type('e2e_user_' + Date.now());
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="repeatPassword"]').type('password123');
    cy.get('input[name="phone"]').type('+375 29 111 1111');
    cy.get('button[type="submit"]').click();

    // after registration, should be redirected to profile page
    cy.url().should('include', '/profile');
    cy.contains('Profile').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('обязаны').should('exist');
  });

  it('should reject invalid phone formats', () => {
    cy.get('input[name="login"]').type('foo');
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="repeatPassword"]').type('123456');
    cy.get('input[name="phone"]').type('invalid-phone');
    cy.get('button[type="submit"]').click();
    cy.contains('Неверный формат телефона').should('exist');
  });
});


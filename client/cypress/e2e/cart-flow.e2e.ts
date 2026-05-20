describe('Cart and checkout (E2E)', () => {
  it('register -> login -> add to cart -> checkout -> leave review', () => {
    cy.visit('/register');
    const login = 'e2e_' + Date.now();
    cy.get('input[name="login"]').type(login);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="repeatPassword"]').type('password123');
    cy.get('input[name="phone"]').type('+375 29 222 2222');
    cy.get('button[type="submit"]').click();

    cy.visit('/login');
    cy.get('input[name="login"]').type(login);
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.visit('/shop');
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('button[data-testid="add-to-cart"]').click();
    });

    cy.visit('/cart');
    cy.get('[data-testid="checkout"]').click();

    cy.contains('Order confirmed').should('exist');

    // go to product and leave review
    cy.visit('/shop');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('textarea[name="review"]').type('Great product! 🚀');
    cy.get('button[data-testid="send-review"]').click();
    cy.contains('Great product!').should('exist');
  });
});


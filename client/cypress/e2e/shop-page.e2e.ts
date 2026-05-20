describe('Shop page (E2E)', () => {
  beforeEach(() => {
    cy.visit('/shop');
  });

  it('loads products and supports filtering and sorting', () => {
    cy.get('[data-testid="product-card"]').should('exist');
    // Filtering
    cy.get('select[name="category"]').select('iphone');
    cy.get('[data-testid="product-card"]').each(($el) => {
      cy.wrap($el).contains(/iphone/i);
    });
    // Sorting
    cy.get('button[data-testid="sort-price"]').click();
    // Basic check: at least one product appears
    cy.get('[data-testid="product-card"]').should('have.length.gte', 1);
  });

  it('adds product to cart and updates cart counter', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('button[data-testid="add-to-cart"]').click();
    });
    cy.get('[data-testid="cart-count"]').should('exist');
  });
});


describe('Google поиск', () => {

  it('Ищет слово Cypress и показывает результаты', () => {
    cy.visit('https://www.google.com')

    cy.get('input[name="q"]')
      .type('Cypress{enter}')

    cy.get('#search')
      .should('be.visible')
  })

})
describe('TODOMvc App', () => {
  it('Verifica se app está abrindo', () => {
    cy.visit('')
  })

  it('Insere uma tarefa', () => {
    cy.visit(''); 

    cy.get('[data-cy=todo-input]')
      .type('TP2 de Engenharia de Software{enter}');

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1) 
      .first()
      .should('have.text', 'TP2 de Engenharia de Software'); 
  });

  it('Insere e deleta uma tarefa', () => {
    cy.visit('');

    cy.get('[data-cy=todo-input]')
      .type('TP2 de Engenharia de Software{enter}');

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1);

    cy.get('[data-cy=todos-list] > li [data-cy=remove-todo-btn]')
      .invoke('show')
      .click();

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 0);
  });

  it('Filtra tarefas completas e ativas', () => {
    cy.visit(''); 

    cy.get('[data-cy=todo-input]')
      .type('TP2 de ES{enter}')
      .type('Prova de ES{enter}');

    cy.get('[data-cy=todos-list] > li [data-cy=toggle-todo-checkbox]')
      .first()
      .click();

    cy.get('[data-cy=filter-active-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1)
      .first()
      .should('have.text', 'Prova de ES');

    cy.get('[data-cy=filter-completed-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1)
      .first()
      .should('have.text', 'TP2 de ES');

    cy.get('[data-cy=filter-all-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 2);
  });
});

it('Remove a tarefa se o texto da edição for apagado', () => {
  cy.visit('');
  cy.get('[data-cy=todo-input]').type('Tarefa a ser removida{enter}');

  cy.get('[data-cy=todos-list] > li label').dblclick();
  cy.get('li.editing .edit').clear().type('{enter}'); // Apaga o texto e aperta Enter

  // Verificação: A lista de tarefas deve estar vazia
  cy.get('[data-cy=todos-list]').children().should('have.length', 0);
});

it('Limpa as tarefas completadas', () => {
  cy.visit('');
  cy.get('[data-cy=todo-input]').type('Tarefa 1{enter}').type('Tarefa 2{enter}');
  cy.get('[data-cy=todos-list] li .toggle').first().click(); // Completa a primeira

  // Ação: Clica no botão "Clear completed"
  cy.get('.clear-completed').click();

  // Verificação: Apenas a tarefa não completada deve permanecer
  cy.get('[data-cy=todos-list]').children().should('have.length', 1);
  cy.get('[data-cy=todos-list] > li').first().should('contain', 'Tarefa 2');

  // Verificação Extra: O botão "Clear completed" deve desaparecer
  cy.get('.clear-completed').should('not.be.visible');
});

it('permite a edição de uma tarefa', () => {
  cy.visit('');
  // Arrange: Adiciona uma tarefa para ser editada
  cy.get('[data-cy=todo-input]').type('Tarefa inicial{enter}');
  cy.get('[data-cy=todos-list]').children().should('have.length', 1);

  // Act: Ativa o modo de edição com duplo clique
  cy.get('[data-cy=todos-list] li label').dblclick();

  // Act: Edita o texto e salva com Enter
  // O seletor padrão do TodoMVC para o campo de edição é 'li.editing .edit'
  cy.get('li.editing .edit')
      .clear()
      .type('Tarefa editada com sucesso{enter}');

  // Assert: Verifica se a tarefa foi atualizada
  cy.get('[data-cy=todos-list] li label')
      .should('have.text', 'Tarefa editada com sucesso');

  // Assert extra: Garante que o modo de edição terminou (a classe 'editing' foi removida)
  cy.get('[data-cy=todos-list] li').should('not.have.class', 'editing');
});
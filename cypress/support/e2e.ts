// cypress/support/e2e.ts
let LocalStorageBackup: Record<string, any> = {};

Cypress.Commands.add('backupLocalStorage', (key: string | Record<string, any>, value?: any) => {
  cy.window().then(win => {
    LocalStorageBackup[key as string] = win.localStorage.getItem(key as string);
  });
});

Cypress.Commands.add('restoreLocalStorage', (key?: string) => {
  cy.window().then(win => {
    win.localStorage.setItem(key as string, LocalStorageBackup[key as string] || '');
  });
});
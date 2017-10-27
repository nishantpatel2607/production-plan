import { ProductionPlanPage } from './app.po';

describe('production-plan App', () => {
  let page: ProductionPlanPage;

  beforeEach(() => {
    page = new ProductionPlanPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

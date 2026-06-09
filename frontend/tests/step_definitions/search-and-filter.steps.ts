import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import assert from 'assert';

setDefaultTimeout(30000);

const FRONTEND_URL = 'http://localhost:5173';
const TIMEOUT = 7000;

let driver: WebDriver;

Before(async function () {
  const options = new chrome.Options();
  options.addArguments('--headless'); 
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080'); // <-- ADICIONE ESTA LINHA

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

After(async function () {
  if (driver) await driver.quit();
});

// ─── GIVEN (Preparação do Estado da Tela) ────────────────────────────────────

// Função auxiliar para garantir que o robô chegue na página certa
async function irParaPaginaDeBusca() {
  await driver.get(FRONTEND_URL);
  const btnPesquisaHeader = await driver.wait(until.elementLocated(By.css('.header-outline-button')), TIMEOUT);
  await btnPesquisaHeader.click();
  
  // Só termina a função quando a barra de pesquisa gigante renderizar na tela nova
  await driver.wait(until.elementLocated(By.css('.search-input-large')), TIMEOUT);
}

Given('o usuário está na página de pesquisa', async function () {
  await irParaPaginaDeBusca();
});

Given('o usuário está na página com as opções de gênero', async function () {
  await irParaPaginaDeBusca();
});

Given('que o usuário pesquisou {string}', async function (termo: string) {
  await irParaPaginaDeBusca();
  
  const searchInput = await driver.findElement(By.css('.search-input-large'));
  await searchInput.sendKeys(termo);

  const searchBtn = await driver.findElement(By.css('.search-button'));
  await searchBtn.click();
});

Given('que o usuário está com o filtro {string} ativado', async function (genero: string) {
  await irParaPaginaDeBusca();
  
  try {
    const dropdownBtn = await driver.findElement(By.css('.search-outline-button'));
    await dropdownBtn.click();
  } catch { 
    // Ignora se já estiver aberto
  }

  const filterBtn = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), "${genero}")]`)), TIMEOUT);
  await filterBtn.click();
});

When('o usuário digita {string} no campo de busca', async function (termo: string) {
  // ATUALIZADO AQUI
  const searchInput = await driver.wait(until.elementLocated(By.css('.search-input-large')), TIMEOUT);
  await searchInput.clear();
  await searchInput.sendKeys(termo);
});

When('clica no botão de pesquisar', async function () {
  // ATUALIZADO AQUI
  const searchBtn = await driver.wait(until.elementLocated(By.css('.search-button')), TIMEOUT);
  await searchBtn.click();
});

When('o usuário seleciona o filtro {string}', async function (genero: string) {
  // 1. Abre o menu dropdown clicando no botão "Selecionar gênero"
  try {
    const dropdownBtn = await driver.wait(until.elementLocated(By.css('.search-outline-button')), TIMEOUT);
    await dropdownBtn.click();
  } catch {
    // Ignora caso o menu já esteja aberto
  }

  const filterBtn = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), "${genero}")]`)), TIMEOUT);
  await filterBtn.click();
});

When('seleciona o filtro {string}', async function (genero: string) {

  try {
    const dropdownBtn = await driver.wait(until.elementLocated(By.css('.search-outline-button')), TIMEOUT);
    await dropdownBtn.click();
  } catch { 
    // Ignora caso o menu já esteja aberto
  }

  const filterBtn = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), "${genero}")]`)), TIMEOUT);
  await filterBtn.click();
});

When('o usuário seleciona a opção {string}', async function () {
  const clearBtn = await driver.wait(
    until.elementLocated(By.xpath(`//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "todos os gêneros")] | //button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "retirar")]`)),
    TIMEOUT
  );
  await clearBtn.click();
});


Then('é exibido a capa e o título do filme {string} como opção', async function (titulo: string) {
  await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(@class, "movie-card") or contains(@data-testid, "movie-card")]//*[contains(text(), "${titulo}")]`)), 
    TIMEOUT
  );
});

Then('é exibido a capa e o título dos filmes {string} e {string} como opções', async function (titulo1: string, titulo2: string) {
  await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(@class, "movie-card") or contains(@data-testid, "movie-card")]//*[contains(text(), "${titulo1}")]`)), 
    TIMEOUT
  );
  await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(@class, "movie-card") or contains(@data-testid, "movie-card")]//*[contains(text(), "${titulo2}")]`)), 
    TIMEOUT
  );
});

Then('é exibido o filme {string} como opção', async function (titulo: string) {
  await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(@class, "movie-card") or contains(@data-testid, "movie-card")]//*[contains(text(), "${titulo}")]`)), 
    TIMEOUT
  );
});

Then('é exibido a mensagem {string}', async function (mensagem: string) {
  const msgElement = await driver.wait(
    until.elementLocated(By.xpath(`//*[contains(text(), "${mensagem}")]`)), 
    TIMEOUT
  );
  const text = await msgElement.getText();
  assert.ok(text.includes(mensagem));
});

Then('é exibido todos os filmes disponíveis da plataforma', async function () {
  await driver.wait(async () => {
    const movies = await driver.findElements(By.css('.movie-card, [data-testid="movie-card"]'));
    return movies.length > 1;
  }, TIMEOUT);
});
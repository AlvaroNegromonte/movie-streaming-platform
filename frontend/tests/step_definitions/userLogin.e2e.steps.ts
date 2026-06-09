import {
  Before,
  After,
  Given,
  Then,
  When,
  setDefaultTimeout,
} from "@cucumber/cucumber";

import { Builder, By, until } from "selenium-webdriver";
import type { WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert";

setDefaultTimeout(30000);

const FRONTEND_URL = "http://localhost:5173";

const seededUsers = new Map<string, string>([
  ["carlos@email.com", "Senha@123"],
  ["maria@email.com", "Maria@123"],
  ["julio@teste.com", "Julio@123"],
]);

let driver: WebDriver;
let expectedLoggedEmail: string | null = null;

async function getBodyText() {
  return driver.findElement(By.css("body")).getText();
}

async function waitForText(text: string, timeout = 15000) {
  await driver.wait(async () => {
    const bodyText = await getBodyText();
    return bodyText.includes(text);
  }, timeout);
}

async function clickButtonContaining(text: string) {
  const button = await driver.wait(
    until.elementLocated(
      By.xpath(`//button[contains(normalize-space(.), "${text}")]`),
    ),
    8000,
  );

  await driver.wait(until.elementIsVisible(button), 15000);
  await button.click();
}

async function clearSession() {
  await driver.executeScript(`
    localStorage.removeItem("cinema_logged_user");
  `);
}

Before(async function () {
  const options = new chrome.Options();

  options.setChromeBinaryPath("/usr/bin/chromium");

  options.addArguments(
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1440,1000",
  );

  const service = new chrome.ServiceBuilder("/usr/bin/chromedriver");

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 15000,
    script: 10000,
  });

  expectedLoggedEmail = null;

  await driver.get(FRONTEND_URL);
  await clearSession();
});

After(async function () {
  if (!driver) {
    return;
  }

  await Promise.race([
    driver.quit(),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]);
});

Given("eu estou na tela inicial do CInema", async function () {
  await driver.get(FRONTEND_URL);
  await clearSession();
  await driver.get(FRONTEND_URL);

  await driver.wait(
    until.elementLocated(
      By.xpath('//button[contains(normalize-space(.), "Fazer Login")]'),
    ),
    15000,
  );
});

Given("eu estou na tela de login", async function () {
  await driver.get(FRONTEND_URL);
  await clearSession();
  await driver.get(`${FRONTEND_URL}/login`);

  await driver.wait(until.elementLocated(By.id("email")), 15000);
  await driver.wait(until.elementLocated(By.id("password")), 15000);
  await waitForText("Acesse sua conta");
});

Given(
  "existe uma conta ativa cadastrada com o e-mail {string}",
  async function (email: string) {
    assert.ok(
      seededUsers.has(email),
      `O usuário ${email} precisa existir na seed para o E2E`,
    );

    expectedLoggedEmail = email;
  },
);

Given(
  "a senha cadastrada para essa conta é {string}",
  async function (password: string) {
    assert.ok(
      expectedLoggedEmail,
      "É necessário informar o e-mail da conta antes da senha",
    );

    const seededPassword = seededUsers.get(expectedLoggedEmail);

    assert.equal(
      password,
      seededPassword,
      `A senha informada no feature deve bater com a seed para ${expectedLoggedEmail}`,
    );
  },
);

Given(
  "não existe uma conta cadastrada com o e-mail {string}",
  async function (email: string) {
    assert.ok(
      !seededUsers.has(email),
      `O e-mail ${email} não deveria existir na seed`,
    );
  },
);

When("eu seleciono a opção {string}", async function (option: string) {
  await clickButtonContaining(option);
});

When(
  "eu preencho o campo de login {string} com {string}",
  async function (fieldName: string, value: string) {
    const normalizedFieldName = fieldName.trim().toLowerCase();

    const inputId =
      normalizedFieldName === "e-mail" || normalizedFieldName === "email"
        ? "email"
        : "password";

    const input = await driver.wait(
      until.elementLocated(By.id(inputId)),
      8000,
    );

    await input.clear();

    if (value) {
      await input.sendKeys(value);
    }
  },
);

When("eu seleciono a opção de login {string}", async function (option: string) {
  if (option === "Entrar") {
    await clickButtonContaining("ENTRAR");
    return;
  }

  throw new Error(`Opção de login não reconhecida no E2E: ${option}`);
});

When("eu acesso a página {string}", async function (pageName: string) {
  if (pageName !== "Minhas Playlists") {
    throw new Error(`Página não reconhecida no E2E: ${pageName}`);
  }

  await waitForText("Página Principal");

  try {
    await clickButtonContaining("Minhas Playlists");
  } catch {
    await driver.get(`${FRONTEND_URL}/playlists`);
  }

  await waitForText("Minhas Playlists");
});

Then("a tela de login deve ser exibida", async function () {
  await waitForText("Acesse sua conta");
});

Then("a página principal da plataforma deve ser exibida", async function () {
  await waitForText("Página Principal");
});

Then("a sessão do usuário deve permanecer ativa", async function () {
  const storedUser = await driver.executeScript<string | null>(`
    return localStorage.getItem("cinema_logged_user");
  `);

  assert.ok(storedUser, "O usuário deveria estar salvo no localStorage");

  if (expectedLoggedEmail) {
    const parsedUser = JSON.parse(storedUser);

    assert.equal(
      parsedUser.email,
      expectedLoggedEmail,
      "O e-mail salvo na sessão deveria ser o e-mail do usuário logado",
    );
  }
});

Then("deve exibir a mensagem {string}", async function (expectedMessage: string) {
  await waitForText(expectedMessage);
});

Then("a tela de login deve continuar sendo exibida", async function () {
  await waitForText("Acesse sua conta");

  const storedUser = await driver.executeScript<string | null>(`
    return localStorage.getItem("cinema_logged_user");
  `);

  assert.equal(
    storedUser,
    null,
    "Não deveria existir usuário salvo após falha no login",
  );
});

Then("as playlists exibidas devem pertencer ao usuário logado", async function () {
  await waitForText("Minhas Playlists");

  const storedUser = await driver.executeScript<string | null>(`
    return localStorage.getItem("cinema_logged_user");
  `);

  assert.ok(storedUser, "O usuário deveria estar salvo na sessão");

  if (expectedLoggedEmail) {
    const parsedUser = JSON.parse(storedUser);

    assert.equal(
      parsedUser.email,
      expectedLoggedEmail,
      "As playlists devem estar sendo acessadas com o usuário autenticado",
    );
  }
});
import { Given, When, Then, Before, DataTable } from "@cucumber/cucumber";
import request from "supertest";
import assert from "assert";
import app from "../../src/index";
import { prisma } from "../../src/database/prisma-client";

let response: request.Response;

Before(async function () {
  await prisma.movie.deleteMany();
  response = undefined as any;
});

Given("o filme {string} está armazenado no sistema", async function (title: string) {
  await prisma.movie.create({
    data: { title, synopsis: "Sinopse", genres: "Drama", duration: "120", file_name: "url" },
  });
});

Given("os filmes {string} e {string} estão armazenados no sistema", async function (title1: string, title2: string) {
  await prisma.movie.createMany({
    data: [
      { title: title1, synopsis: "Sinopse", genres: "Ficção Científica", duration: "100", file_name: "url1" },
      { title: title2, synopsis: "Sinopse", genres: "Comédia", duration: "110", file_name: "url2" }
    ]
  });
});

Given("o sistema possui vários filmes armazenados, mas nenhum com o título {string}", async function (notTitle: string) {
  await prisma.movie.create({
    data: { title: "Filme Genérico", synopsis: "Sinopse", genres: "Ação", duration: "90", file_name: "url" }
  });
});

Given("o filme {string} classificado como {string} está armazenado no sistema", async function (title: string, genre: string) {
  await prisma.movie.create({
    data: { title, synopsis: "Sinopse", genres: genre, duration: "120", file_name: "url" }
  });
});

Given("o filme {string} classificado como {string} e {string} classificado como {string} estão no sistema", async function (t1: string, g1: string, t2: string, g2: string) {
  await prisma.movie.createMany({
    data: [
      { title: t1, synopsis: "Sinopse", genres: g1, duration: "100", file_name: "url1" },
      { title: t2, synopsis: "Sinopse", genres: g2, duration: "100", file_name: "url2" }
    ]
  });
});

Given("o sistema possui os seguintes filmes armazenados:", async function (dataTable: DataTable) {
  const filmes = dataTable.hashes().map(row => ({
    title: row.titulo,
    genres: row.genero,
    synopsis: "Sinopse genérica",
    duration: "100",
    file_name: "url_padrao"
  }));
  await prisma.movie.createMany({ data: filmes });
});

When("eu peço ao sistema para buscar pelo título {string}", async function (title: string) {
  response = await request(app).get(`/movies?search=${encodeURIComponent(title)}`);
});

When("eu peço ao sistema para listar os filmes do gênero {string}", async function (genre: string) {
  response = await request(app).get(`/movies?genre=${encodeURIComponent(genre)}`);
});

When("eu peço ao sistema para buscar pelo título {string} e filtrar pelo gênero {string}", async function (title: string, genre: string) {
  response = await request(app).get(`/movies?title=${encodeURIComponent(title)}&genre=${encodeURIComponent(genre)}`);
});

When("eu peço ao sistema para listar todos os filmes sem filtros", async function () {
  response = await request(app).get(`/movies`);
});

Then("o sistema retorna os dados do filme {string}", function (title: string) {
  assert.strictEqual(response.status, 200);
  const contemFilme = response.body.some((movie: any) => movie.title === title);
  assert.ok(contemFilme, `Filme ${title} não encontrado`);
});

Then("o sistema retorna os filmes {string} e {string}", function (title1: string, title2: string) {
  assert.strictEqual(response.status, 200);
  const titulos = response.body.map((m: any) => m.title);
  assert.ok(titulos.includes(title1), `Faltou: ${title1}`);
  assert.ok(titulos.includes(title2), `Faltou: ${title2}`);
});

Then("o sistema retorna uma lista vazia", function () {
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.length, 0);
});

Then("o sistema retorna apenas o filme {string}", function (title: string) {
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.length, 1, "Deveria retornar apenas 1 filme");
  assert.strictEqual(response.body[0].title, title);
});

Then("o sistema retorna uma lista contendo {int} filmes", function (quantidade: number) {
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.length, quantidade);
});

Given("o filme {string} continua armazenado no sistema", async function (title: string) {
  const filmeNoBanco = await prisma.movie.findFirst({ where: { title: title } });
  assert.ok(filmeNoBanco !== null);
});

Given("os filmes {string} e {string} continuam armazenados no sistema", async function (title1: string, title2: string) {
  const f1 = await prisma.movie.findFirst({ where: { title: title1 } });
  const f2 = await prisma.movie.findFirst({ where: { title: title2 } });
  assert.ok(f1 !== null && f2 !== null);
});
module.exports = {
  default: {
    paths: ["../cucumber/features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["tests/step_definitions/**/*.ts"],
  },

  login: {
    paths: ["../cucumber/features/user_login_service.feature"],
    requireModule: ["ts-node/register"],
    require: ["tests/step_definitions/userLogin.steps.ts"],
  },

};
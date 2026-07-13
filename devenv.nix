{ pkgs, config, ... }:

let
  secrets = config.secretspec.secrets;
in
{
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  packages = [
    pkgs.openssl
    pkgs.chromium
    pkgs.secretspec
  ];

  env = {
    CHROMIUM_PATH = "${pkgs.chromium}/bin/chromium";
    FSR_MEMBERS = secrets.FSR_MEMBERS or "";
    ASSOCIATED_MEMBERS = secrets.ASSOCIATED_MEMBERS or "";
    DEFAULT_START_TIME = secrets.DEFAULT_START_TIME or "";
    DEFAULT_LOCATION = secrets.DEFAULT_LOCATION or "";
    DEFAULT_ROOM = secrets.DEFAULT_ROOM or "";
    DISCORD_WEBHOOK_URL = secrets.DISCORD_WEBHOOK_URL or "";
    DISCORD_PASSWORD = secrets.DISCORD_PASSWORD or "";
  };

  enterShell = ''
    if [ ! -f .env.local ] && [ -f example.env.local ]; then
      cp example.env.local .env.local
      echo "Created .env.local from example.env.local — edit member lists and Discord settings."
      echo "Re-run devenv shell (or direnv reload) to load secrets from .env.local."
    fi
  '';

  scripts = {
    dev.exec = "npm run dev";
    build.exec = "npm run build";
    lint.exec = "npm run lint";
    previews.exec = "npm run previews";
    "previews-install".exec = "npm run previews:install";
  };

  processes.dev = {
    exec = "npm run dev";
    process-compose.availability.restart = "on_failure";
  };

  enterTest = ''
    npm run lint
    npm run build
  '';
}

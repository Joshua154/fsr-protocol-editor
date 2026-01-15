{
  description = "Flake for packaging and developing the FSR Protocol Editors Next.js app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        nodejs = pkgs.nodejs_22;
        nodePackages = pkgs.nodePackages_latest;
      in {
        packages.default = nodePackages.buildNodePackage rec {
          pname = "fsr-protocol-editor";
          version = "0.1.0";
          src = ./.;

          buildInputs = [pkgs.openssl];
          nativeBuildInputs = [pkgs.yarn];

          buildPhase = ''
            npm ci --legacy-peer-deps
            npm run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r . $out/
          '';

          meta = with pkgs.lib; {
            description = "Editor for FSR Protocols build wiht Next.js";
            license = licenses.mit;
            platforms = platforms.unix;
          };
        };

        devShells.default = pkgs.mkShell {
          packages = [
            nodejs
            pkgs.yarn
            pkgs.openssl
          ];

          shellHook = ''
            echo "------------------------------------------------"
            echo "FSR Protocl Editor Dev Shell"
            echo "------------------------------------------------"
          '';
        };
      }
    );
}

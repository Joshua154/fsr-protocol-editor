# FSR Protocol Editor

A web-based editor for managing and generating protocols for Student Council (FSR-Informatik) meetings. Built with Next.js and Tailwind CSS.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Built with devenv](https://devenv.sh/assets/devenv-badge.svg)](https://devenv.sh)
[![wakatime](https://wakatime.com/badge/user/04b6ff37-1c8c-4a0c-bf7e-85a2901d61d1/project/d96edfb2-e2ca-4dd8-a18a-d19d5f419d85.svg)](https://wakatime.com/badge/user/04b6ff37-1c8c-4a0c-bf7e-85a2901d61d1/project/d96edfb2-e2ca-4dd8-a18a-d19d5f419d85)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Data Handling**: [js-yaml](https://github.com/nodeca/js-yaml)


## Preview

The screenshots below are auto-generated. Re-generate them anytime with:

```bash
npm run previews:install
npm run previews
```

On **NixOS**, Playwright's downloaded browsers may not run (stub-ld). Use devenv's bundled Chromium instead:

```bash
devenv shell
npm run previews
```

### Full Interface

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Full View Light](./preview/readme-previews/light/full.png) | ![Full View Dark](./preview/readme-previews/dark/full.png) |

### Member Selection

| Light Mode | Dark Mode |
| :---: | :---: |
| ![People Select Light](./preview/readme-previews/light/member_select.png) | ![People Select Dark](./preview/readme-previews/dark/member_select.png) |

### Session Management

| Light Mode | Dark Mode |
| :---: | :---: |
| ![New Session Item Light](./preview/readme-previews/light/new_session_item.png) | ![New Session Item Dark](./preview/readme-previews/dark/new_session_item.png) |

<!-- ### Dialogs

| Feature | Light Mode | Dark Mode |
| :--- | :---: | :---: |
| Reset confirm | ![Reset Confirm Light](./preview/readme-previews/light/dialog_reset_confirm.png) | ![Reset Confirm Dark](./preview/readme-previews/dark/dialog_reset_confirm.png) |
| Import confirm | ![Import Confirm Light](./preview/readme-previews/light/dialog_import_confirm.png) | ![Import Confirm Dark](./preview/readme-previews/dark/dialog_import_confirm.png) |
| Clipboard confirm | ![Clipboard Confirm Light](./preview/readme-previews/light/dialog_clipboard_confirm.png) | ![Clipboard Confirm Dark](./preview/readme-previews/dark/dialog_clipboard_confirm.png) |
| Discord confirm | ![Discord Confirm Light](./preview/readme-previews/light/dialog_discord_confirm.png) | ![Discord Confirm Dark](./preview/readme-previews/dark/dialog_discord_confirm.png) |
| Discord password | ![Discord Password Light](./preview/readme-previews/light/dialog_discord_password.png) | ![Discord Password Dark](./preview/readme-previews/dark/dialog_discord_password.png) |
| Discord error | ![Discord Error Light](./preview/readme-previews/light/dialog_discord_error.png) | ![Discord Error Dark](./preview/readme-previews/dark/dialog_discord_error.png) | -->

## Features

- **Session Management**: Easily organize meeting topics and points with Drag-and-Drop functionality.
- **Attendance Tracking**: Manage present FSR members, protocolant, and guests.
- **Protocol Metadata**: Set date, start time, and end time for the session.
- **Import/Export**:
  - Support for the YAML protocol data structure used by the current Discord Bot.
  - Clipboard integration for quick pasting the generated protocol Template.
- **Theming**: Dark and Light mode support.

## Getting Started

### Prerequisites

- [Nix](https://nixos.org/download/) and [devenv](https://devenv.sh/getting-started/) (recommended), or Node.js 22+ with npm

### Development with devenv

1.  Clone the repository:
    ```bash
    git clone https://github.com/Joshua154/fsr-protocol-editor.git
    cd fsr-protocol-editor
    ```

2.  Enter the developer environment:
    ```bash
    devenv shell
    ```
    With [direnv](https://direnv.net/) installed, run `direnv allow` once; the environment activates automatically when you `cd` into the repo.

3.  On first entry, devenv runs `npm install` and copies `example.env.local` to `.env.local` if it does not exist. Edit `.env.local` with your secrets (declared in [`secretspec.toml`](secretspec.toml)), then reload the environment:
    ```bash
    direnv reload   # or re-run devenv shell
    ```
    Example values:
    ```env
    FSR_MEMBERS=Member1,Member2,Member3
    ASSOCIATED_MEMBERS=Guest1,Guest2
    ```
    You can also manage secrets with the [SecretSpec](https://secretspec.dev/) CLI: `secretspec set FSR_MEMBERS --provider dotenv:.env.local`

4.  Run the development server:
    ```bash
    npm run dev
    ```
    Or start it via the process manager:
    ```bash
    devenv up
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Installation without devenv

1.  Clone the repository and install dependencies:
    ```bash
    git clone https://github.com/Joshua154/fsr-protocol-editor.git
    cd fsr-protocol-editor
    npm install
    ```

2.  Configure environment variables:
    ```bash
    cp example.env.local .env.local
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

### Running with Docker

You can also run the application using Docker. This is useful for deployment or testing in a clean environment.

1.  **Configure Environment Variables**:
    You can set environment variables in `docker-compose.yml` or use an `.env.local` file.
    
    ```env
    FSR_MEMBERS="Alice [Ali, A], Bob, Charlie"
    ASSOCIATED_MEMBERS="Dave [David], Eve"
    ```
    You can define aliases for members using brackets `[]`. Searching for "Ali" will suggest "Alice".

2.  **Start the Container**:
    ```bash
    docker compose up -d --build
    ```
    or use this example
    ```yaml
    services:
        editor:
            image: ghcr.io/joshua154/fsr-protocol-editor:main
            container_name: fsr-protocol-editor
            ports:
            - "3000:3000"
            env_file:
            - .env.local
    ```

    ```bash
    docker compose up -d
    ```

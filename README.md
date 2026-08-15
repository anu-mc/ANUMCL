# AHNUMCL

> AHNUMCL is based on [SJMCL](https://github.com/UNIkeEN/SJMCL), and is distributed under GPLv3 with the upstream additional terms in [LICENSE.EXTRA](LICENSE.EXTRA).

[![Test Build](https://img.shields.io/github/actions/workflow/status/ahnumc/AHNUMCL/test.yml?label=test%20build&logo=github&style=for-the-badge)](https://github.com/ahnumc/AHNUMCL/blob/main/.github/workflows/test.yml)
![Downloads](https://img.shields.io/github/downloads/ahnumc/AHNUMCL/total?logo=github&style=for-the-badge)
![Stars](https://img.shields.io/github/stars/ahnumc/AHNUMCL?style=for-the-badge)

**English** · [简体中文](docs/README.zh-Hans.md) · [繁體中文](docs/README.zh-Hant.md)

## Features

* **Cross Platform**: Supports Windows 10/11, macOS and Linux.
* **Efficient Instance Management**: Supports multiple game directories and instances, allowing the management of all instance resources (such as saves, mods, resource packs, shaders, screenshots, etc.) and settings in one place.
* **Convenient Resource Download**: Supports downloading game clients, mod loaders, various game resources and modpacks from CurseForge and Modrinth.
* **Multi-Account System Support**: Built-in Microsoft login and third-party authentication server support, compatible with the OAuth login process proposed by the Yggdrasil Connect proposal.
* **External Service Collaboration**: Works with external webpages, applications, and Agent services through deeplinks and MCP services, delivering a range of convenient features and automation capabilities.
* **Open Extension System**: Supports extension development to extend the launcher with more interesting and practical features. [>> View Community Extensions](https://github.com/SJMC-Dev/awesome-SJMCL-extensions/blob/main/README.en.md)

> Note: some features may be limited by region, platform, or bundle type.

### Built with

[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white&labelColor=24C8DB)](https://tauri.app/)
[![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Chakra UI](https://img.shields.io/badge/chakra_ui-v2-38B2AC?style=for-the-badge&logo=chakraui&logoColor=white&labelColor=319795)](https://v2.chakra-ui.com/)

## Getting Started

Download the latest AHNUMCL release from [GitHub Releases](https://github.com/ahnumc/AHNUMCL/releases).

AHNUMCL currently supports the following platforms:

| Platform  | Versions            | Architectures              | Provided Bundles                        |
|-----------|---------------------|----------------------------|-----------------------------------------|
| Windows   | 10 and above       | `aarch64`, `i686`, `x86_64`| installer `.exe`, portable `.exe`                 |
| macOS     | 10.15 and above     | `aarch64`, `x86_64`        | `.app`, `.dmg`                          |
| Linux     | webkit2gtk 4.1 (e.g., Ubuntu 22.04) | `aarch64`, `x86_64`   | `.deb`, `.rpm`, portable binary |

## Development and Contributing

To get started, clone the repository and install the required dependencies:

```bash
git clone https://github.com/ahnumc/AHNUMCL.git
pnpm install
```

To run the project in development mode:

```bash
pnpm tauri dev
```

We warmly invite contributions from everyone. 

* Before you get started, review the [Contributing Guide](CONTRIBUTING.md).
* Report issues through [GitHub Issues](https://github.com/ahnumc/AHNUMCL/issues).


## Copyright

Copyright © 2024-2026 AHNUMC and SJMCL contributors.

> NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.

The software is distributed under [GNU General Public License v3.0](/LICENSE).

By GPLv3 License term 7, we require that when you distribute a modified version of the software, you must obey GPLv3 License as well as the following [additional terms](/LICENSE.EXTRA): 

1. Use a different software name than SJMCL or SJMC Launcher;
2. Mark clearly in your repository README file, your distribution website or thread, Support documents, About Page in the software that your program is based on SJMCL and give out the url of the origin repository.
3. When your modifications to this software are limited solely to **adding** (without modifying or deleting) preset authentication servers (`src-tauri/src/account/helpers/authlib_injector/constants.rs`), the restrictions set forth in Clauses 1 above shall not apply. In this case, you may continue to compile and distribute the software under its original name.

Besides, per term of use of our website, when distributing a modified version of the software, please send version numbers with prefix (more than two letters, e.g. `XX-0.0.1`) to our statistics server (`src-tauri/src/utils/sys_info.rs`) unless your modifications meets Clauses 3 above.

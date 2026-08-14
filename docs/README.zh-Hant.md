# ANUMCL

> ANUMCL 基於 [SJMCL](https://github.com/UNIkeEN/SJMCL) 開發，並依據 GPLv3 及上游 [附加條款](../LICENSE.EXTRA) 發布。

[![Test Build](https://img.shields.io/github/actions/workflow/status/anu-mc/ANUMCL/test.yml?label=test%20build&logo=github&style=for-the-badge)](https://github.com/anu-mc/ANUMCL/blob/main/.github/workflows/test.yml)
![Downloads](https://img.shields.io/github/downloads/anu-mc/ANUMCL/total?logo=github&style=for-the-badge)
![Stars](https://img.shields.io/github/stars/anu-mc/ANUMCL?style=for-the-badge)

[English](../README.md) · [简体中文](README.zh-Hans.md) · **繁體中文**

## 功能特性

* **跨平臺支援**：相容 Windows 10/11、macOS 與 Linux。
* **高效的實例管理**：支援多個遊戲目錄與實例，集中管理存檔、模組、資源包、光影包、截圖等資源與設定。
* **便捷的資源下載**：支援從 CurseForge 與 Modrinth 等來源下載遊戲用戶端、模組載入器、各類遊戲資源與模組包。
* **多帳戶系統支援**：內建 Microsoft 登入與第三方認證伺服器支援，相容 Yggdrasil Connect 的 OAuth 登入流程規範提案。
* **外部服務協同**：透過深度連結與 MCP 服務，與外部網頁、程式及 Agent 服務協同運作。
* **開放擴展系統**：支援擴展開發，擴充啟動器功能。

> 注意：部分功能可能受地區、執行平臺或程式發行類型限制。

## 開始使用

請從 [ANUMCL Releases](https://github.com/anu-mc/ANUMCL/releases) 下載最新版本。

| 平臺 | 系統版本 | 架構 | 提供的發行類型 |
| --- | --- | --- | --- |
| Windows | 10 及以上 | `aarch64`、`i686`、`x86_64` | 安裝版 `.exe`、便攜版 `.exe` |
| macOS | 10.15 及以上 | `aarch64`、`x86_64` | `.app`、`.dmg` |
| Linux | webkit2gtk 4.1（如 Ubuntu 22.04） | `aarch64`、`x86_64` | `.deb`、`.rpm`、便攜版二進位檔案 |

第三方軟體來源尚未設定，請直接使用 GitHub Releases 中的安裝檔。

## 開發與貢獻

複製本專案並安裝前端依賴：

```bash
git clone https://github.com/anu-mc/ANUMCL.git
cd ANUMCL
pnpm install
```

使用開發模式執行：

```bash
pnpm tauri dev
```

請透過 [Pull Requests](https://github.com/anu-mc/ANUMCL/pulls) 或 [Issues](https://github.com/anu-mc/ANUMCL/issues) 參與貢獻。

## 版權與授權

版權所有 © 2024-2026 ANU-MC 與 SJMCL 貢獻者。

> 本軟體並非官方 Minecraft 服務，未獲得 Mojang 或 Microsoft 批准或關聯許可。

本專案基於 [GNU 通用公眾授權條款 v3.0](../LICENSE) 發布，並適用上游 SJMCL 的 [GPLv3 第 7 條附加條款](../LICENSE.EXTRA)。

# ANUMCL

> ANUMCL 基于 [SJMCL](https://github.com/UNIkeEN/SJMCL) 开发，并依据 GPLv3 及上游 [附加条款](../LICENSE.EXTRA) 发布。

[![Test Build](https://img.shields.io/github/actions/workflow/status/anu-mc/ANUMCL/test.yml?label=test%20build&logo=github&style=for-the-badge)](https://github.com/anu-mc/ANUMCL/blob/main/.github/workflows/test.yml)
![Downloads](https://img.shields.io/github/downloads/anu-mc/ANUMCL/total?logo=github&style=for-the-badge)
![Stars](https://img.shields.io/github/stars/anu-mc/ANUMCL?style=for-the-badge)

[English](../README.md) · **简体中文** · [繁體中文](README.zh-Hant.md)

## 功能特性

* **跨平台支持**：兼容 Windows 10/11、macOS 与 Linux。
* **高效的实例管理**：支持多个游戏目录与实例，集中管理存档、模组、资源包、光影包、截图等资源与设置。
* **便捷的资源下载**：支持从 CurseForge 与 Modrinth 等源下载游戏客户端、模组加载器、各类游戏资源与整合包。
* **多账户系统支持**：内置 Microsoft 登录与第三方认证服务器支持，兼容 Yggdrasil Connect 的 OAuth 登录流程规范提案。
* **外部服务协同**：通过深度链接与 MCP 服务，与外部网页、程序及 Agent 服务协同工作。
* **开放扩展系统**：支持扩展开发，扩展启动器的功能。

> 注意：部分功能可能受地区、运行平台或程序分发类型限制。

## 开始使用

请从 [ANUMCL Releases](https://github.com/anu-mc/ANUMCL/releases) 下载最新版本。

| 平台 | 系统版本 | 架构 | 提供的分发类型 |
| --- | --- | --- | --- |
| Windows | 10 及以上 | `aarch64`、`i686`、`x86_64` | 安装版 `.exe`、便携版 `.exe` |
| macOS | 10.15 及以上 | `aarch64`、`x86_64` | `.app`、`.dmg` |
| Linux | webkit2gtk 4.1（如 Ubuntu 22.04） | `aarch64`、`x86_64` | `.deb`、`.rpm`、便携版二进制文件 |

第三方软件源尚未配置，请直接使用 GitHub Releases 中的安装包。

## 开发与贡献

克隆本项目并安装前端依赖：

```bash
git clone https://github.com/anu-mc/ANUMCL.git
cd ANUMCL
pnpm install
```

使用开发模式运行：

```bash
pnpm tauri dev
```

请通过 [Pull Requests](https://github.com/anu-mc/ANUMCL/pulls) 或 [Issues](https://github.com/anu-mc/ANUMCL/issues) 参与贡献。

## 版权与许可

版权所有 © 2024-2026 ANU-MC 和 SJMCL 贡献者。

> 本软件并非官方 Minecraft 服务，未获得 Mojang 或 Microsoft 批准或关联许可。

本项目基于 [GNU 通用公共许可证 v3.0](../LICENSE) 发布，并适用上游 SJMCL 的 [GPLv3 第 7 条附加条款](../LICENSE.EXTRA)。

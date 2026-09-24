# MCPs

[Home](../README.md) · [Agents](agents.md) · [Skills](skills.md) · [Evidence labels](README.md)

Connections that let an assistant work with design files, components, and running interfaces. Sources reviewed September 24, 2026. All entries below are **source reviewed**, not connection or workflow tests.

| Connection | Maintainer | What it connects |
| --- | --- | --- |
| [Figma](#figma) | Official | Design context and native canvas workflows |
| [Paper](#paper) | Official | Editable HTML/CSS-based designs |
| [Webflow](#webflow) | Official | Site design and CMS |
| [Penpot](#penpot) | Official project | Open-source design files |
| [shadcn/ui](#shadcnui) | Official project | Component registries |
| [Framelink](#framelink) | Community | Figma context for implementation |
| [Figma Console](#figma-console) | Community, Southleft | Figma inspection and automation |
| [Playwright](#playwright) | Official project, Microsoft | Browser interaction and inspection |

## Figma

Read layouts, components, and variables; use supported tools to create or modify native canvas content. Code Connect can help agents reuse an existing component implementation.

Requires a Figma account, file access, and a supported MCP client. Remote and desktop servers have different features and limits. Follow Figma's current setup and skills guidance for canvas writes.

[Documentation and setup](https://developers.figma.com/docs/figma-mcp-server/)

## Paper

Read and write Paper designs, generate layouts, and use selected frames as implementation context.

Requires Paper Desktop and a compatible assistant. Follow the application's connection flow; current documentation uses the Paper CLI for several clients. Do not assume older local HTTP examples describe the current recommended setup.

[Documentation and setup](https://paper.design/docs/mcp)

## Webflow

Connect an assistant to site elements, styles, components, variables, and CMS content.

Requires access to the relevant Webflow workspace. Capabilities depend on role and plan; certain canvas operations require the Designer and Bridge App. Publishing is a separate action from preparing a design.

[Documentation and setup](https://developers.webflow.com/mcp/reference/overview)

## Penpot

Connect an assistant to editable design files in the Penpot environment.

Requires the MCP server and the Penpot integration described by the project. Follow its current installation instructions and check the supported version of the application.

[Project documentation and setup](https://github.com/penpot/penpot/blob/develop/docs/mcp/index.md)

## shadcn/ui

Search component registries and bring available components into an application. Useful for building with concrete UI primitives.

Requires an MCP-compatible client and the relevant registry/project configuration. It supplies component resources, not access to a design canvas. Private registries may need credentials.

[Documentation and setup](https://ui.shadcn.com/docs/mcp)

## Framelink

Provides Figma layout information to coding agents for design-to-code work.

Requires the server setup and Figma API access described upstream. This is an independent integration; do not assume it exposes the official server's canvas-write capabilities.

[Source and setup](https://github.com/GLips/Figma-Context-MCP)

## Figma Console

Southleft's integration for design-system extraction, creation, and debugging in Figma.

Setup varies by connection mode and may involve a desktop bridge or plugin. Check the upstream capability table for the chosen mode before promising read or write operations.

[Source and setup](https://github.com/southleft/figma-console-mcp)

## Playwright

Lets an assistant navigate and interact with a browser, inspect page structure, and capture evidence for interface review.

Requires the runtime and browser setup documented upstream. Browser inspection supports QA but does not by itself prove visual quality or accessibility compliance.

[Source and setup](https://github.com/microsoft/playwright-mcp)

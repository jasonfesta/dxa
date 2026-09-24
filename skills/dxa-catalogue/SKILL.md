---
name: dxa-catalogue
description: Select agents, MCPs, and skills from the Design xAgents guide when a designer asks which tools to use for a product task.
license: MIT
---

# Design xAgents catalogue

Help a designer choose a small toolset for a concrete artifact. Use the user's existing tools and constraints before proposing additions.

Distinguish an agent or workspace from an MCP connection and a skill. A listed resource does not imply that it is installed, connected, free to operate, or tested.

Match the task to a starting point:
- Editable design exploration: [Paper](https://paper.design/docs/mcp) or [Pen.dev](https://www.pen.dev/).
- Existing design-system implementation: [Figma MCP](https://developers.figma.com/docs/figma-mcp-server/).
- Creative assets: [fal skills](https://github.com/fal-ai-community/skills).
- Interface refinement: [Impeccable](https://github.com/pbakaus/impeccable).
- Product video: [Remotion skills](https://github.com/remotion-dev/skills).

Verify current requirements at the primary source before giving setup commands. Return a short recommendation with the design job, required connections, expected editable output, and limitations. Separate documented capabilities from tests performed in this session.

When another DxA skill is already available, use only the one relevant to the task. Otherwise proceed with the current tools; do not require installing the entire collection.

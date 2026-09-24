# Skills

[Home](../README.md) · [Agents](agents.md) · [MCPs](mcps.md) · [Evidence labels](README.md)

Skills give assistants reusable instructions. They do not automatically install a runtime, connect an MCP, or supply a paid product account.

Start with [DxA's own skills](../skills/README.md), then add focused upstream guidance when the work needs it. The external sources below were reviewed September 24, 2026; none has a completed DxA workflow test recorded.

## Impeccable

**Paul Bakaus / pbakaus · Skill and review tools**

Use for interface critique, audit, and refinement. Choose guidance that fits the product's existing identity. Its stylistic preferences should not silently replace a brand's decisions.

Follow the current installer and supported-client instructions. [Source and setup](https://github.com/pbakaus/impeccable)

## UI Craft

**educlopez · Design engineering package**

Use for implementation and refinement of product interfaces. Requires a compatible coding agent and project; inspect the package's additional tooling before installing it.

[Source and setup](https://github.com/educlopez/ui-craft)

## Interaction Design

**rastian · Skill**

Use to specify flows, states, affordances, feedback, and recovery. Particularly useful before turning a happy-path prototype into a product interaction.

Requires a skill-capable assistant; validate the resulting behavior with real users or task tests. [Source and setup](https://github.com/rastian/interaction-design-skills)

## Design Tokens

**ilikescience · Skill**

Use to organize design decisions as structured tokens. Bring the current token files, naming conventions, and theme requirements into the task.

Check format and pipeline compatibility before changing production tokens. [Source and setup](https://github.com/ilikescience/design-tokens-skill)

## Emil Kowalski's Skills

**Emil Kowalski · Skill collection**

Guidance for designers and engineers, including interface and animation craft. Select the relevant skill from the collection for the current task.

Requires a compatible agent; motion implementation still needs browser and reduced-motion review. [Source and setup](https://github.com/emilkowalski/skills)

## fal

**fal-ai-community · Skill collection**

Use for creative media workflows supported by fal models. Select the current skill and model for the required image, video, or other output.

Requires provider credentials and usage credits for generation. Older catalogue pointers referenced retired package paths; follow the current repository. No generation run is claimed here.

[Source and setup](https://github.com/fal-ai-community/skills)

## Remotion

**remotion-dev · Official skill collection**

Use for video and product walkthroughs built with React. Keep source assets and timings editable.

The skill is guidance. Rendering requires a Remotion project, runtime, and applicable product license. Earlier local research installed the guidance only.

[Source and setup](https://github.com/remotion-dev/skills)

## Anthropic Skills

**Anthropic · Official collection**

A source of frontend and creative workflow instructions. Select the relevant skill instead of importing an entire collection by default.

Compatibility, dependencies, and licensing vary by skill; read the selected directory's instructions and license. [Source and setup](https://github.com/anthropics/skills)

## Taste Skill

**Leonxlnx · Skill collection**

Use to explore intentional frontend visual direction. Its aesthetic rules are opinionated; compare them with the audience, brand, and product constraints.

Requires a compatible assistant and the relevant implementation context. [Source and setup](https://github.com/Leonxlnx/taste-skill)

## Color Expert

**meodai · Skill**

Use for color spaces, palette decisions, and contrast reasoning. Bring the actual foreground/background combinations and intended display context.

Verify contrast in the implemented interface; a palette recommendation is not an accessibility audit. [Source and setup](https://github.com/meodai/skill.color-expert)

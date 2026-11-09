---
id: forms-settings
title: Forms, settings, wizards
surface: Configure
keywords: form, settings, preferences, config, wizard, onboarding form, checkout, signup, profile, account, setup, input, validation
---
# Forms, settings and wizards

**Core tasks:** change one setting fast · complete a multi-step flow without losing work · understand an error and fix it.

**Must exist**
- Visible labels (placeholder is not a label), help text under, errors linked with aria-describedby.
- Validate on blur, not per keystroke; keep input on error; focus first invalid field on submit.
- Correct type / inputmode / autocomplete; Ctrl/Cmd+Enter submits textareas.
- Settings: group by task, search, save state (auto-save with "Saved" or explicit save with dirty indicator), reset to default.
- Wizard: step indicator, back without data loss, review step, resume later.
- States: pristine, dirty, saving, saved, error, disabled with reason.

**Effects budget:** inline success check, error shake ≤ 300 ms (none with reduced motion).

**Slop risks:** floating labels everywhere; giant centered single-column form on desktop for 2 fields; toggles for actions that need confirmation.

**Astryx:** templates `settings`, `settings-sidebar`, `settings-dialog`, `form-wizard`, `form-wizard-inline`, `form-wizard-vertical`, `form-wizard-dialog`, `form-two-column`, `contact-form`, `payment-form`, `checkout-wizard`.
---
title: odsl:install generator breaks on Rails 8.1
tags: [gotcha, rails, odsl, upstream-bug]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# `odsl:install` generator breaks on Rails 8.1

`bin/rails generate odsl:install` (odsl 0.3.0) crashes with `wrong number of arguments (given 3, expected 0)` in `lib/generators/odsl/install_generator.rb:17:in 'create_migration'`, calling `migration_template` incompatibly with how Rails 8.1's `Rails::Generators::Migration#migration_template` now takes its arguments.

Worked around in [[app-scaffold]] (T1.1) by generating a blank migration (`bin/rails generate migration CreateOdslTables`) and hand-copying the table definitions from `lib/generators/odsl/templates/create_odsl_tables.rb.erb` into it — the initializer (`config/initializers/odsl.rb`) is created fine by the same generator and didn't need a workaround.

This is a real upstream bug in `odsl` itself (`github.com/aleguro/ODSL`), not a project-specific issue — worth fixing there so future `rails generate odsl:install` runs don't need this workaround.

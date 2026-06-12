.PHONY: install_hooks uninstall_hooks activate publish-atproto

install_hooks:
	@git config core.hooksPath .githooks
	@chmod +x .githooks/*
	@echo "✓ Git hooks installed (core.hooksPath = .githooks)"

uninstall_hooks:
	@git config --unset core.hooksPath
	@echo "✓ Git hooks uninstalled"

# Activate mise for the current bash shell (one-shot, no shell-rc changes).
# Make recipes run in a subshell, so we print env exports and let the parent
# shell eval them: `eval "$(make activate)"`.
activate:
	@if [ -t 1 ]; then \
		echo "Run this to activate mise in your current shell:" >&2; \
		echo '  eval "$$(make activate)"' >&2; \
		exit 1; \
	fi
	@mise trust --quiet
	@mise install --quiet
	@mise env -s bash

# Publish/update Standard.site records to the PDS via Sequoia, then write each
# post's document AT-URI back into its frontmatter. Run before deploying so the
# emitted <link> tags resolve. Requires the global CLI: `bun i -g sequoia-cli`.
# See README → "Standard.site / AT Protocol".
publish-atproto:
	@command -v sequoia >/dev/null 2>&1 || { \
		echo "sequoia CLI not found — install it with: bun i -g sequoia-cli" >&2; \
		exit 1; \
	}
	sequoia publish

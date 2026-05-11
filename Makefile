.PHONY: install_hooks uninstall_hooks activate

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

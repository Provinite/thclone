- Commit changes routinely. Especially when finishing a major step or feature. Use succinct commit messages with the standard commit syntax eg feat(index): add new route
- Always use yarn instead of npm
- Always use yarn dlx instead of npx
- Every time you run cd, it changes your directory in a stateful way. Ensure you are on top of which directory you are in (note: does not apply to subshell cd's)
- Always update the project status document when your current feature/implementation status changes
- Always update the project plan when new requirements are discovered or requested by the user
- You can always just run `yarn install` from the project root to install dependencies for the entire repository
- This project is yarn 4 monorepo
- You can execute yarn scripts in a particular package by running `yarn workspace ${PACKAGE_NAME} ${SCRIPT_NAME}` (example: `yarn workspace @chardb/backend build`)
  - Prefer this method to the subshell when available
- To execute commands in subdirectories, use the bash subshell syntax instead of cd'ing into directories
- You can type check the entire repository by running `yarn type-check` in the root
- Jaeger trace analysis is available at http://localhost:16686
- You cannot directly start the servers with the dev command. The servers run indefinitely, and you will get stuck waiting for the logs. If you need the servers running, or details from the logs, just ask the user directly instead.
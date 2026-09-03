## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your first action should be `graphify query "<question>"` when `graphify-out/graph.json`
exists. Use `graphify path "<A>" "<B>"` for relationship questions and `graphify explain "<concept>"`
for focused-concept questions. These return a scoped subgraph, usually much smaller than the full
report or raw grep output.

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

If `graphify-out/wiki/index.md` exists, use it for broad navigation. Read `graphify-out/GRAPH_REPORT.md`
only for broad architecture review or when query/path/explain do not surface enough context. Only read
source files when (a) modifying/debugging specific code, (b) the graph lacks the needed detail, or
(c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.

## Ponytail

Use an efficient senior-developer approach:

1. Check whether the work is needed at all.
2. Reuse existing code and dependencies before adding anything.
3. Prefer standard-library and native-platform solutions.
4. Write the minimum code that fully solves the request.

Understand the task and trace the relevant flow before editing. Fix root causes
instead of patching individual symptoms. Avoid unnecessary abstractions,
boilerplate, and dependencies; prefer deletion and the smallest correct diff.
Do not compromise input validation, error handling, security, accessibility, or
data-loss prevention. For non-trivial logic, leave one runnable check behind.

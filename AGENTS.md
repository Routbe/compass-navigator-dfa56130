<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Repository import
- Preserve the imported ROUT TanStack application, its existing public URLs, and its design; source imports must exclude Git metadata, environment secrets, dependencies, and generated route trees.
- Keep the managed Lovable build scripts and deployment target; the documentation catalog and MDX plugins are required by the imported docs routes.
- Preserve the imported TypeScript compatibility settings with null checks enabled; stricter template-only flags are incompatible with the existing source.
- Retain imported service adapters without running database migrations or copying credentials; account, storage, email, and payment functionality requires separately verified service configuration.

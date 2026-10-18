# MCP / integration stack — platform release

Wire what your tenant allows. Phase 1 works with **no** MCP (manifest links only).

## Recommended

| System | Integration | Permissions |
|--------|-------------|-------------|
| GitLab | Native [GitLab MCP](https://docs.gitlab.com/user/model_context_protocol/mcp_server/) or REST `read_api` | Read projects, MRs, pipelines, environments |
| Jira | Atlassian MCP / Jira REST | Read issues + filter by fixVersion; optional comment |
| Agile LM | Vendor API or scheduled export → `releases/<id>/alm.json` | Read train boarding |
| Confluence | Atlassian API | Read page title + lastModified |
| SharePoint | Microsoft Graph (Sites.Read.All as needed) | Validate file exists + modified |
| Teams | Power Automate HTTP webhook | Post only to release channel |

## Example `.cursor/mcp.json` entries (illustrative)

```json
{
  "mcpServers": {
    "gitlab": {
      "url": "https://gitlab.example.com/api/v4/mcp"
    },
    "atlassian": {
      "url": "https://mcp.atlassian.com/v1/sse"
    }
  }
}
```

Use OAuth/device flow per vendor. **Never commit tokens.**

## Teams outbound (Phase 3)

1. Power Automate: trigger **When an HTTP request is received**.
2. Action: **Post message in a chat or channel**.
3. Store URL in Cursor secret `TEAMS_RELEASE_WEBHOOK`.
4. Manifest field `teams_webhook: confirmed` enables posts.

## Join conventions

Ask engineers to put Jira keys in MR titles (`PLAT-123`) and link GitLab MRs on Jira development panels when available.

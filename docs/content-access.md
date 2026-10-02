# Staff content access

In **Admin → More → Users**, open or create a user:

1. Set **Role** to **Restricted staff**.
2. Select **Allowed content areas**. Multiple areas can be selected.
3. Choose **View only** or **Manage**, then save.

| Area | Included content |
| --- | --- |
| Merchandise | Product catalog, inventory, merchandise orders and sales |
| Program | Sessions, rooms, venue maps, program board and private preview |
| Registration | Contacts, attendee roster, registration entitlements, breakfast tickets, access codes, checkout/cash records, scholarship contributions and correction history |

Manage permits creating, editing and deleting records within selected areas. Existing collection restrictions still apply: correction history remains immutable. Registration managers can use the audited CRM correction workflow. View-only staff can browse their selected areas without saving changes. Staff with no selected area have no content access.

Restricted staff can browse shared public media. Managers may upload new assets; replacing and deleting shared media requires an administrator, since other teams may use those images.

Only administrators can create/delete accounts or change roles, allowed areas and access levels. Staff can update their own account details without changing permissions. Website pages, global navigation, themes, email configuration and MCP credentials remain outside the three staff areas.

Administrator accounts retain full access. Existing accounts without a role keep their legacy administrator access. The existing global read-only viewer and legacy merchandise-sales viewer roles remain available; choose Restricted staff for the new area-specific permissions.

The same policy restricts API reads/writes, version history, admin navigation, dashboard queries, custom views and the private program preview. Public published content and server-to-server registration integrations continue using their existing access rules.

Verification: `node --import tsx tests/content-access.test.ts` exercises the permissions matrix, cross-area denial, own-account access, protected permission fields, media restrictions and immutable audit records.

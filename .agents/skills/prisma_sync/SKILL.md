---
name: prisma_sync
description: Syncs the Prisma schema, generates the Prisma client, and verifies type safety for the ATOMIC ERP database.
---

# Prisma Sync Skill

When requested to run a database sync or update Prisma:

1. **Verify Schema Modifications**: Confirm if `prisma/schema.prisma` has been recently modified.
2. **Run Generation**: Run the command `npx prisma generate` in the `atomic--erp` workspace.
3. **Handle Errors**: If there are syntax errors in the schema, fix them by editing `prisma/schema.prisma` and run the generation again.
4. **Inform the User**: Provide a summary of the generated client version and confirm that type definitions are updated.

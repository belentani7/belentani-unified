# Project TODO

- [x] Multi-niche dashboard with centralized niche selection
- [x] Create and manage niche configurations
- [x] Dedicated prospect intake form per niche
- [x] Store prospect name, contact, service type, source, notes, consent, and opt-out state
- [x] Fixed lead stages: New, Contacted, Qualified, Proposal Sent, Follow-up, Won, Lost
- [x] Kanban pipeline with drag-and-drop stage updates
- [x] Configurable message templates per niche
- [x] Configurable follow-up timing per niche
- [x] Automatic follow-up scheduling when a lead enters a configured stage
- [x] Record lead arrival time and first outreach time
- [x] Average first-response time per niche
- [x] Per-niche KPI dashboard: total leads, response time, proposals sent, follow-ups triggered, won/lost ratio, recovered opportunities
- [x] Consent tracking on every contact
- [x] Immediate automation halt when a prospect opts out
- [x] needs human review flag that pauses all automation
- [x] Owner alerts for hot leads, due follow-ups, and needs human review
- [x] Save full niche configuration as reusable template
- [x] Clone reusable niche templates for new clients
- [x] Premium responsive visual design
- [x] Vitest coverage for core business rules and API procedures
- [x] Browser visual verification and final QA

## Follow-up after deployment/integration

- [ ] Connect a real outbound email/SMS/WhatsApp provider and store its approved sender credentials
- [ ] Create the production Heartbeat job for /api/scheduled/process-followups after the site is deployed
- [ ] Add an in-dashboard edit/archive dialog for niche metadata
- [ ] Add end-to-end browser interaction tests for create niche, intake submission, drag-and-drop, and template cloning

## Heavy audit and backup

- [x] Run a deep audit of source code, database schema, permissions, scheduled automation, and production configuration
- [ ] Correct all audit findings that can be resolved without third-party credentials or deployment
- [x] Produce an audit report with verified checks, findings, limitations, and remediation status
- [ ] Save the audited project to a new private GitHub repository
- [ ] Upload the audited project archive and audit report to Google Drive
- [x] Prevent public intake callers from setting the internal hot-lead flag
- [x] Preserve correct template-to-rule associations when cloning a niche template
- [x] Upgrade or constrain vulnerable production dependencies identified by the audit
- [x] Scope scheduled follow-up processing to its owning niche and Heartbeat task
- [x] Enforce consent and terminal-stage checks in the due-task query and atomic task claim
- [x] Reduce public niche enumeration by exposing only minimum intake metadata through an opaque public key
- [x] Add server-side anti-spam safeguards to public intake
- [x] Add audit tests covering cron scope, consent gates, and duplicate follow-up processing
- [x] Define and document lead-retention and anonymization controls
- [x] Reduce oversized request-body limits because AION intake does not accept file uploads
- [x] Add audit tests covering cron scope, consent gates, and duplicate follow-up processing
- [x] Make due follow-up claiming atomic by rechecking lead eligibility in the same claim path
- [ ] Test duplicate follow-up processing against the database-backed claim path
- [ ] Test that the authenticated scheduled callback only processes its assigned niche
- [x] Add per-client intake rate limiting with a documented autoscale limitation
- [x] Document accepted non-blocking audit risks for bundle size and integration-test environment constraints

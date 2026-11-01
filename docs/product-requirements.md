# Product requirements
Investigate whether clearer status explanations, explicit next actions, contextual recovery guidance and modification prerequisites improve the KYC experience. This is a hypothesis to test, not a result.

## Functional requirements
- FR1 [Must] Show the current status using one of eight named states (decision P2)
- FR2 [Must] Show a specific reason and next action for each issue (decision P1)
- FR3 [Must] Allow correcting only the affected item and keep other data (decision P1)
- FR4 [Must] Show prerequisites before a modification starts (decision P3)
- FR5 [Must] Track modification requests separately from onboarding (decision P3)
- FR6 [Should] Show timing guidance with stated uncertainty (decision P5)
- FR7 [Could] Group eligible changes in one request (decision P4)
- FR8 [Should] Save and resume demo state locally (decision -)

## Non-functional
- WCAG 2.2 AA where feasible
- Keyboard operable
- Respect reduced motion
- No sensitive data in URLs, storage or events
- Static hosting

## Acceptance criteria
- Impossible status transitions are rejected
- Each issue shows reason and next action
- Back navigation keeps valid input
- Disclaimer visible on the demo

## Acceptance criteria by journey
- Journey A: Continue is disabled until details are valid and the clear sample is chosen; Each warning names the problem; Review lists every value with an Edit link; Submit creates a demo ID in the Submitted state
- Journey B: Only allowed status moves are enabled; Every issue shows a reason and a next action; Correcting changes only the flagged item and a review step shows changed and kept values; History lists every state in order
- Journey C: Fields not open to self-service are labelled; Requirements are shown before editing; Review shows old and new values side by side; A separate modification ID is created and tracked on its own

## Edge cases by journey
- Journey A: Reload mid-flow; Switching journeys and returning; Going Back after editing details
- Journey B: Rejection after a rejection; Verified applications cannot be rejected; Tracking opened before any application exists
- Journey C: Address too short; Modification submitted while an onboarding application exists; Request verified, then another change started

## Risks
- Prototype implies approval or real verification
- Timing text read as a guarantee
- Documentation differs from the live app

## Out of scope
- Real verification or provider integrations
- Real documents or personal data
- Regulatory interpretation
- Claims of improved outcomes

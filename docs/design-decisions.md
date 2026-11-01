# Design decisions
Every decision below is a proposal derived from documented competitor behavior. None has been tested, and no improvement in real outcomes is claimed.

Verified competitor capabilities are listed under Observation. Proposed TRACE changes are listed under Decision.

## P1 Reason and corrective action on the same screen
- Observation: Zerodha and Angel One document multiple rejection causes with corrections.
- Hypothesis: Documented fixes may still be hard to find or act on when they live in separate help pages.
- Decision: Show the specific problem and the corrective action together on the status screen.
- Expected effect: Hypothesised: more users complete the correction. Not measured.
- Metric: Recovery success rate
- Evidence: Z03, A02, A03
- Alternatives considered: Link out to help articles; send the fix only by email/SMS.
- Trade-off: Needs structured rejection reasons from the verification backend.
- Validation: Usability test: find and perform the correction from a rejected state.

## P2 Separate "Waiting for you" from "Under external review"
- Observation: Zerodha documents that KRA verification may delay activation.
- Hypothesis: Users may not know whether a delay needs their action or depends on an external party.
- Decision: Split pending states into user-action and external-review groups with a named next step.
- Expected effect: Hypothesised: fewer status-related support contacts. Not measured.
- Metric: Status-related support contact rate
- Evidence: Z02, G02, G05
- Alternatives considered: One generic "Pending" state; a single progress bar.
- Trade-off: Requires reliable knowledge of which party holds the application.
- Validation: Five-second test and task: "what do I need to do now?".

## P3 Show modification prerequisites before starting
- Observation: Groww starts address changes through support; Angel One uses DigiLocker and e-sign; Zerodha documents online and offline procedures.
- Hypothesis: Routes differ by platform, so users may begin a change they cannot finish online.
- Decision: Show eligibility, required documents and re-verification before any form field.
- Expected effect: Hypothesised: higher initiation-to-completion rate. Not measured.
- Metric: Modification initiation-to-completion rate
- Evidence: G03, A05, Z04
- Alternatives considered: Show requirements only after the form is filled; a chatbot triage.
- Trade-off: Adds a screen before editing; eligibility must be accurate.
- Validation: A/B or moderated test comparing prerequisites-first with form-first.

## P4 Group eligible changes into one request
- Observation: Angel One documents online address, email and mobile modification requests.
- Hypothesis: Separate requests for related changes may cause repeated steps.
- Decision: Let eligible changes share one request while keeping the verification each needs.
- Expected effect: Hypothesised: fewer repeated steps. Not measured.
- Metric: Repeated-step rate
- Evidence: A04, U05
- Alternatives considered: Keep one request per field.
- Trade-off: Regulatory rules may force separate processes for some fields.
- Validation: Task study with a two-field change.

## P5 Timing guidance with stated uncertainty
- Observation: Published processing windows differ: Zerodha 48 working hours, Groww 2 working days, Angel One up to 3 working days.
- Hypothesis: A single countdown would overpromise because windows depend on KRA and review.
- Decision: Show the platform's published window as guidance, with what could extend it.
- Expected effect: Hypothesised: clearer expectations. Not measured.
- Metric: Perceived clarity in usability tests
- Evidence: Z02, G01, A01, G05
- Alternatives considered: No timing at all; a precise ETA.
- Trade-off: Vague wording may feel unhelpful.
- Validation: Compare comprehension of expectation wording.

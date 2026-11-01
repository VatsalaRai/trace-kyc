# User journey analysis
Friction points are untested hypotheses. Evidence IDs show which documented behavior informed each one.

## Journey A: First-time onboarding
- **Prepare**: goal Know what is needed; action Reads requirements; system Shows checklist; friction (hypothesis) Unclear which documents and linked numbers are needed; opportunity Preparation checklist before any form; dependency Aadhaar-mobile linkage, PAN; evidence Z01, G01, U01, A01
- **Verify identity**: goal Prove identity; action Chooses DigiLocker or alternative; system Redirects to external step; friction (hypothesis) External steps may feel like a hand-off with no context; opportunity Explain the hand-off and the return path; dependency DigiLocker, e-sign; evidence Z01, A05
- **Upload**: goal Submit clear documents; action Uploads images; system Quality checks; friction (hypothesis) Rejection reasons may appear only after submission; opportunity Early quality checks with specific messages; dependency Image quality, name match; evidence Z03, A02
- **Wait**: goal Know the outcome; action Checks status; system Shows state; friction (hypothesis) Unclear who holds the application; opportunity Named states and next step; dependency KRA, internal review; evidence Z02, G01, A01

## Journey B: Tracking and recovery
- **See status**: goal Find where it stands; action Opens status; system Shows state; friction (hypothesis) Status may not say what happens next; opportunity One next-step line per state; dependency Status data; evidence Z02, A01
- **Understand delay**: goal Know if action is needed; action Reads delay info; system Shows published window; friction (hypothesis) Windows differ by step and may be read as promises; opportunity Guidance with stated uncertainty; dependency KRA; evidence Z02, G05
- **Understand issue**: goal Know what to fix; action Reads reason; system Shows reason; friction (hypothesis) Reasons can sit in separate help or email; opportunity Reason and action on one screen; dependency Structured reasons; evidence Z03, A02
- **Resubmit**: goal Fix and send again; action Corrects affected item; system Re-queues; friction (hypothesis) Re-entering unaffected data; opportunity Preserve unaffected data; dependency Resubmission link or flow; evidence A03, Z03

## Journey C: Modifying existing KYC
- **Find the route**: goal Change a detail; action Searches help; system Shows routes; friction (hypothesis) Routes differ: online, support-led, or form; opportunity Show eligible routes first; dependency Eligibility rules; evidence U02, G03, Z04
- **Know requirements**: goal Know what is needed; action Reads requirements; system Lists documents; friction (hypothesis) Requirements discovered mid-process; opportunity Prerequisites before editing; dependency Supporting documents; evidence G03, A05, U03
- **Edit and submit**: goal Submit the change; action Edits fields; system Validates; friction (hypothesis) Related changes need repeated steps; opportunity Group eligible changes; dependency Verification per field; evidence A04, U05
- **Track change**: goal Know when done; action Checks status; system Shows request state; friction (hypothesis) Modification status may be mixed with onboarding; opportunity Separate modification tracking; dependency Processing time; evidence G04, A05

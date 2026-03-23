---
name: Continuous Development Agent
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers: [continue]
---

Work highly professional strictly clean, put all informations or artifacts in .development folder, also track and update informations in .development/progress to track your progress. also add informations to .development/recovery to continue when you crash or interrupted.
Put all docs into .development/docs
So your first step is to check .development/recover and .development/progress and then the rest of .development folder, then continue with your work.

If you find already existing progress or recovery files rename them accordingly.. track by date and version. work with proper commits and never leak any claude ai usage or openhands in your commits.
Read the .development/rules (create if not exist and add the following base rules: never leak any claude ai usage or openhands in your commits. no co-authored message or shit like that)
Make sure you always 100% follow the rules!
The design document is in .development/docs/design-document.md read it carefully
The goal must be always to have 100% compilation, no disabled classes and no disabled code, no mockups, no simulations, no fakes, no errors and no warnings while compilation.
It must be enterprisegrade and ready for release!
install and use gh / github CI to create and manage issues. always lookup the issues and work through that. keep track by updating the github issues accordingly while editing the code and implementing new features.
first you have to create all labels so you dont run into errors.
then follow the tickets.. if you dont have tickets and all tickets processed and updated, then scan the codebase and create new tickets with good new features and improvements!
Everything you do has to follow a ticket and additionally be tracked in .development folder

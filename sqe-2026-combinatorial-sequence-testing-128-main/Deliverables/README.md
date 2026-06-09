# Deliverables

This directory contains the deliverables for the project. 

1. **SUT Database Backup:**
After preparing the testing environment as described in the assignment instructions, you need to download a backup of the PrestaShop database and save it in this directory as `prestashop_db_backup.sql.gz`. See the assignment instructions for more details.
2. **Provengo:**
The [Provengo directory](/Provengo) should contain all the deliverables related to the Provengo model, including:
   1. The behavior file(s).
   2. The action file(s).
   3. The data file(s).
   4. Any additional files or resources used in the Provengo tests.

   All of these files should be properly documented (with code comments) and organized within the Provengo directory.
3. A video file named [prestashop_testing_demo.mp4](prestashop_testing_demo.mp4) demonstrating the execution of a random walk on the PrestaShop SUT. Place this file in the Deliverables directory.
4. Change the following sections in this README.md file to reflect your work.
5. Commit and push all the changes to your GitHub repository.
6. Submit a single txt file named `submission.txt` to the assignment page in Moodle. The file should contain the link to your GitHub repository.

## Explanation of the Provengo model
The Provengo model describes a complete and valid checkout flow in a PrestaShop store and verifies the correctness of the final price shown to the user.

The model is event-based: each event represents a logical user action such as choosing a customer type, selecting product attributes (size and quantity), entering checkout details, choosing country and carrier, and verifying the final price.

The MainFlow bthread generates full purchase scenarios by requesting events in the correct order. Business constraints are modeled directly in the flow.

The verify Final Price bthread acts as a validation oracle. It listens to the selected options during the scenario, calculates the expected total price based on pricing rules (size, quantity, VIP discounts, country tax, and shipping cost), and asserts that the calculated value matches the price displayed in the UI.

For test suite generation, an ensemble configuration is used with pairwise (two-way) coverage goals across the main parameters (customer type, size, quantity, carrier, and country). Invalid combinations are filtered out. A ranking function selects suites that maximize coverage while minimizing redundant scenarios.

Overall, the model combines controlled behavior generation, business constraints, price validation, and pairwise coverage to systematically test the checkout process.

## The behavior graph
The graph represents all valid execution paths of the checkout process defined in the Provengo model. It starts with the Open Store event and then branches according to the main decision points in the flow.

After these choices, all paths converge toward the final step, Verify Final Price.
Each branching point in the graph corresponds to a choose(...) statement in behavior.js.

Validation of correctness:

The behavior graph was validated by checking that:
The order of events in the graph matches the sequence defined in the MainFlow bthread.
All expected branching points appear in the graph, and no unexpected branches are present.
Invalid combinations (e.g., Guest users selecting registered countries) do not appear, confirming that business constraints are correctly enforced in the model.
Every valid path in the graph ends in the Verify Final Price event, ensuring that all scenarios reach the verification stage.

## The action graph
The graph represents all valid end-to-end executions from opening the store until Verify Final Price, but now each branch contains:
the business-level choices (customer type, size, quantity, country, carrier), and
the concrete Selenium steps that implement them (e.g., selecting dropdown options by XPath, clicking “Continue”, filling checkout fields, waiting/sleeping for page transitions, and extracting totalAmount).

You can clearly see that “choice” nodes exist exactly where we have choose(...) in the behavior model, and between them the graph contains the UI-level action sequences from actions.js (many Click, write text, store "totalAmount"). 


How I validated the graph is correct:

Behavior-to-actions alignment: For each high-level event the graph includes the expected Selenium operations right after it, confirming that actions.js is correctly bound to the behavior events. 

Branching only at intended decision points: The major branching in the graph occurs only around the modeled choices (customer/size/qty/country/carrier). All other steps are linear UI transitions, which matches the intended design of a single checkout flow with controlled variability. 

End-to-end completion: Paths reach the final verification stage (Verify Final Price) and include reading totalAmount followed by an equality check (assertion output appears in the graph), showing scenarios are not stopping prematurely. 

Constraints preserved: Illegal combinations are not present as valid paths because the behavioral constraints prevent generating them, and therefore the action graph cannot realize them either.

## The coverage criteria
The [ensemble-code.js](/Provengo/provengo_project/meta-spec/ensemble-code.js) file should include the code for both criteria. The criteria should be well documented and explained. You may comment out one criterion so that the code will compile.

### Two-way criterion
I implemented the two-way (pairwise) coverage criterion in ensemble-code.js by defining the main decision dimensions in the model as event sets:
   Customer type: Guest / Registered / VIP
   Size: S / M / L
   Quantity: 1 / 4
   Carrier: My carrier / My cheap carrier
   Country: France / USA / Registered USA / Registered France
Then, makeGoals() automatically generates all pairs between different dimensions (i.e., for every i<j, it creates all combinations e1 × e2). Each goal is represented as an array [e1, e2], and a goal is considered covered only if both events appear in the same scenario (this is enforced in countMetGoals() when isTwoWay is true).

Constraints (domain rules)
Some pairs are impossible in the SUT due to business logic (modeled in behavior.js):
Guest cannot select Registered countries.
Registered/VIP cannot select Guest countries (France/USA).
Therefore, inside makeGoals() I filter out these invalid Customer × Country pairs using continue, so the goal set includes only feasible two-way pairs.

Sampling + ensemble generation

I ran sample to generate 1500 samples.
Then I ran ensemble with --size 20, and selected an ensemble with rank = 100, meaning it achieves full goal coverage and all scenarios contribute to coverage according to the ranking function.
Size of the generated test suite

Test suite size: 20 scenarios.

The ensemble output reported full coverage of the feasible two-way goals (consistent with rank 100 in the ranking function).



### Domain-specific
The domain-specific criterion is implemented in ensemble-code.js by using the GOALS array of single EventSets,Each goal in this list represents a business-relevant option in the PrestaShop checkout flow, such as:

Customer type: Guest / Registered / VIP
Size: S / M / L
Quantity: 1 / 4
Carrier: My carrier / My cheap carrier
Country: France / USA / Registered USA / Registered France

the coverage is one-way: a goal is considered covered if the corresponding event appears in at least one scenario in the selected ensemble (as handled by the non-two-way branch in countMetGoals when isTwoWay is set to false).

Why this criterion is relevant to the PrestaShop SUT

This criterion was chosen because these parameters are the main drivers of checkout behavior and pricing in the PrestaShop SUT:

customer type affects the available country options and discounts,country affects VAT/tax rules,carrier affects shipping cost,size and quantity affect the product price and discounts.

Therefore, covering each domain option at least once gives a compact suite that still exercises the key business logic of the checkout process.
Sampling + ensemble generation

I ran sample to generate 1500 samples.

Then I ran ensemble and selected a suite that satisfies the domain-specific goals.

Test suite size: 4 scenarios.

The ensemble command reported full coverage of the domain-specific goals, meaning that all required domain events appear at least once across the 4 scenarios , all of them is passed.

## Detected Bugs
If you detected any bugs during your testing, provide a detailed description of each bug here. Include the general description, steps to reproduce, expected result, actual result, and a link to the bug report if applicable. If you did not detect any bugs, you can simply state that no bugs were found during the testing process.

An example format for reporting bugs is provided below:

We detected the following bugs:
1. Bug 1:
   1. General description: ...
   2. Steps to reproduce: ...
   3. Expected result: ...
   4. Actual result: ...
   5. Link to the bug report: (you are encouraged to report the bug to the developers of the software)
2. Bug 2: ...

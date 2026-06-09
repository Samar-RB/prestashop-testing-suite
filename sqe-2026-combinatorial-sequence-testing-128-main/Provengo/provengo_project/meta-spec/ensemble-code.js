// @provengo summon ctrl


const customerType = [
    any(/^Set Customer: Guest$/),
    any(/^Set Customer: Registered$/),
    any(/^Set Customer: VIP$/),
];

const sizeType = [
    any(/^Set Size: S$/),
    any(/^Set Size: M$/),
    any(/^Set Size: L$/),
];

const qtyType = [
    any(/^Set Qty: 1$/),
    any(/^Set Qty: 4$/),
];

const carrierType = [
    any(/^Set Carrier: My carrier$/),
    any(/^Set Carrier: My cheap carrier$/),
];

const countryType = [
    any(/^Set Country: France$/),
    any(/^Set Country: USA$/),
    any(/^Set Country: Registered USA$/),
    any(/^Set Country: Registered France$/),
];
const Es = [customerType, sizeType, qtyType, carrierType, countryType];

/**
    * Goals to be covered by the test suite in domain-specific manner.
    * Each goal is represented as an EventSet or an array of EventSets
 */
/*
 const GOALS = [
     any(/Set Customer: Guest/),
     any(/Set Customer: Registered/),
     any(/Set Customer: VIP/),
     any(/Set Size: S/),
     any(/Set Size: M/),
     any(/Set Size: L/),
     any(/Set Qty: 1/),
     any(/Set Qty: 4/),
     any(/Set Carrier: My carrier/),
     any(/Set Carrier: My cheap carrier/),
     any(/Set Country: France/),
     any(/Set Country: USA/),
     any(/Set Country: Registered USA/),
     any(/Set Country: Registered France/)
 ];
 */


const makeGoals = function () {
    const res = [];
    let i = 0;
    while (i < Es.length) {
        let eventList1 = Es[i];
        let j = i + 1;
        while (j < Es.length) {
            let eventList2 = Es[j];
            for (let e1 of eventList1) {
                for (let e2 of eventList2) {

                    if (i == 0 && j == 4) {
                        if ((e1 === Es[0][0] && (e2 === Es[4][2] || e2 === Es[4][3]))) continue; // Guest cannot choose Registered countries
                        if ((e1 === Es[0][1] && (e2 === Es[4][0] || e2 === Es[4][1]))) continue; // Registered cannot choose Guest countries
                        if ((e1 === Es[0][2] && (e2 === Es[4][0] || e2 === Es[4][1]))) continue; // VIP cannot choose Guest countries

                    }
                    res.push([e1, e2]);
                }
            }
            j++;
        }
        i++;
    }
    return res;
}

const GOALS = makeGoals();

const isTwoWay = true;

function printgoals() {
    bp.log.info("Goals:");
    for (let g of GOALS) {
        if (Array.isArray(g)) {
            let names = g.map(e => e.name).join(" + "); 
            bp.log.info("  Goal: " + names);
        } else {
            bp.log.info("  Goal: " + g.name);
        }
    }
}

// Uncomment to print goals at runtime
 //printgoals();
/**
 * Counts how many goals are met by the passed test suite.
 * @param {Event[][]} ensemble Test suite to be ranked.
 * @param {EventSet[]} goals Goals to be covered by the test suite.
 * @returns How many goals were met by the test suite.
 */
// /**
//  * Counts how many goals are met by the passed test suite.
//  * @param {Event[][]} ensemble Test suite to be ranked.
//  * @param {EventSet[]} goals Goals to be covered by the test suite.
//  * @returns How many goals were met by the test suite.
//  */
function countMetGoals(ensemble, goals) {
    let metGoals = 0;

    if (isTwoWay) {
        /**
         * "Two-Way" coverage usually implies that for a goal (which is an array of EventSets),
         * ALL EventSets in that specific goal must appear within the SAME test scenario.
         */
        goalLoop: for (let goalPair of goals) {
            for (let test of ensemble) {
                // Check if every EventSet in this goal exists in this specific test
                let allPartsFound = goalPair.every((eventSet) =>
                    test.some((event) => eventSet.contains(event)),
                );

                if (allPartsFound) {
                    metGoals++;
                    continue goalLoop;
                }
            }
        }
    } else {
        // One-Way coverage: Goal is met if any EventSet in the list is found
        goalLoop: for (let goal of goals) {
            for (let test of ensemble) {
                for (let event of test) {
                    if (goal.contains(event)) {
                        metGoals++;
                        continue goalLoop;
                    }
                }
            }
        }
    }
    return metGoals;
}

/**
 * Counts how many test scenarios in the passed ensemble cover at least one goal.
 */
function countGoalMeeters(ensemble, goals) {
    let meeters = 0;

    scenarioLoop: for (let scenario of ensemble) {
        for (let goalEntry of goals) {
            // Logic for "meeting a goal" depends on if it's a single EventSet or an array
            if (Array.isArray(goalEntry)) {
                // For Two-Way goals: Does this scenario satisfy all parts of this goal?
                let satisfied = goalEntry.every((eventSet) =>
                    scenario.some((event) => eventSet.contains(event)),
                );
                if (satisfied) {
                    meeters++;
                    continue scenarioLoop;
                }
            } else {
                // For standard EventSet goals
                if (scenario.some((event) => goalEntry.contains(event))) {
                    meeters++;
                    continue scenarioLoop;
                }
            }
        }
    }
    return meeters;
}

/**
 * Rank test suites based on how many goals the hit, and how many 
 * scenarios hit goals.
 * 
 *  Examples:
 *   - Suite covering all goals, each scenario covers at least one goal: 100
 *   - Suite covering all goals, 30% scenarios don't cover any goal: 70
 *   - Suite covering 8 out of 10 goals, each scenario cover at least one goal: 80
 *   - Suite covering 7 out of 10 goals, 5 out of 100 scenarios don't cover any goal: 66.5
 * 
 *  rank = (% covered goals) * (% goal covering scenarios) * 100
 * 
 * @param {Event[][]} ensemble Test suite to be ranked.
 * @returns Score of the test suite.
 */
function rankingFunction(ensemble) {

    // How many goals did `ensemble` hit?
    const metGoalsCount = countMetGoals(ensemble, GOALS);
    const metGoalsPercent = metGoalsCount / GOALS.length;

    const goalMeeters = countGoalMeeters(ensemble, GOALS);
    const goalMeetersPercent = goalMeeters / ensemble.length;
     return metGoalsPercent * goalMeetersPercent * 100; // convert to human-readable percentage
}

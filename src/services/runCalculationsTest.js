import {
  calculateSectionWeight,
  calculateTaskWeight,
  calculateSectionProgress,
  calculateSectionContribution,
  calculateDailyMetrics,
  formatPercentage,
  getMotivationalTier,
  calculateStreaks
} from './calculationEngine.js';

console.log('🧪 RUNNING COMPREHENSIVE CALCULATION & ENGINE TESTS...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
    passedTests++;
  }
}

// Case 1: 5 Sections x 5 Tasks
{
  const secWeight = calculateSectionWeight(5);
  assert(secWeight === 20, 'Case 1: 5 Sections weight is exactly 20%');

  const taskWeight = calculateTaskWeight(5, 5);
  assert(taskWeight === 4, 'Case 1: 5 Sections x 5 Tasks -> Task Weight is exactly 4%');

  const mockTasks = [
    { progressPercentage: 100 },
    { progressPercentage: 100 },
    { progressPercentage: 100 },
    { progressPercentage: 0 },
    { progressPercentage: 0 }
  ];
  const sectionProgress = calculateSectionProgress(mockTasks);
  assert(sectionProgress === 60, 'Case 1: 3 of 5 tasks completed -> Section Progress is 60%');

  const mockSection = { active: true, tasks: mockTasks };
  const contribution = calculateSectionContribution(mockSection, 5);
  assert(Math.abs(contribution - 12) < 0.0001, 'Case 1: Section Contribution is 12% (60% of 20%)');
}

// Case 2: 10 Sections
{
  const secWeight = calculateSectionWeight(10);
  assert(secWeight === 10, 'Case 2: 10 Sections weight is exactly 10%');

  const taskWeight = calculateTaskWeight(10, 5);
  assert(taskWeight === 2, 'Case 2: 10 Sections x 5 Tasks -> Task Weight is 2%');
}

// Case 3: Section with 1 Task
{
  const taskWeight = calculateTaskWeight(5, 1);
  assert(taskWeight === 20, 'Case 3: Section with 1 task has Task Weight equal to Section Weight (20%)');
}

// Case 4: Adding a new section (from 5 to 6)
{
  const oldWeight = calculateSectionWeight(5);
  const newWeight = calculateSectionWeight(6);
  assert(oldWeight === 20, 'Case 4: Before addition weight is 20%');
  assert(Math.abs(newWeight - 16.6666667) < 0.0001, 'Case 4: After adding 6th section weight is 16.6667%');
  assert(formatPercentage(newWeight) === '16.7%', 'Case 4: Formatted percentage is 16.7%');
}

// Case 5: Deleting a section (from 5 to 4)
{
  const newWeight = calculateSectionWeight(4);
  assert(newWeight === 25, 'Case 5: Deleting a section (4 sections) gives 25% each');
}

// Case 6: Adding a task to a section (from 2 tasks to 3 tasks)
{
  const taskWeightBefore = calculateTaskWeight(5, 2);
  const taskWeightAfter = calculateTaskWeight(5, 3);
  assert(taskWeightBefore === 10, 'Case 6: 2 tasks in 20% section = 10% each');
  assert(Math.abs(taskWeightAfter - 6.6666667) < 0.0001, 'Case 6: 3 tasks in 20% section = 6.67% each');
}

// Case 7: Deleting a task from a section (from 4 tasks to 3 tasks in a 20% section)
{
  const taskWeightBefore = calculateTaskWeight(5, 4);
  const taskWeightAfter = calculateTaskWeight(5, 3);
  assert(taskWeightBefore === 5, 'Case 7: 4 tasks in 20% section = 5% each');
  assert(Math.abs(taskWeightAfter - 6.6666667) < 0.0001, 'Case 7: 3 tasks in 20% section = 6.67% each');
}

// Case 8: Granular percentages (0, 10, 30, 50, 70, 100) & full daily calculation
{
  const sampleSections = [
    {
      id: 's1',
      active: true,
      tasks: [
        { progressPercentage: 100 }, // 100% of 10% = 10%
        { progressPercentage: 50 },  // 50% of 10% = 5%
      ] // Section total = 15% out of 20%
    },
    {
      id: 's2',
      active: true,
      tasks: [
        { progressPercentage: 70 },  // 70% of 20% = 14%
      ] // Section total = 14% out of 20%
    },
    {
      id: 's3',
      active: true,
      tasks: [
        { progressPercentage: 30 },  // 30% of 10% = 3%
        { progressPercentage: 10 },  // 10% of 10% = 1%
      ] // Section total = 4% out of 20%
    },
    {
      id: 's4',
      active: true,
      tasks: [
        { progressPercentage: 100 }, // 100% of 20% = 20%
      ] // Section total = 20% out of 20%
    },
    {
      id: 's5',
      active: true,
      tasks: [
        { progressPercentage: 0 },   // 0%
      ] // Section total = 0% out of 20%
    }
  ];

  const metrics = calculateDailyMetrics(sampleSections);
  // Expected daily = 15 + 14 + 4 + 20 + 0 = 53%
  assert(Math.abs(metrics.dailyProgress - 53) < 0.0001, `Case 8: Daily progress matches granular sum: expected 53%, got ${metrics.dailyProgress}%`);
  assert(metrics.computedSections[0].contribution === 15, 'Case 8: Section 1 contribution is 15%');
  assert(metrics.computedSections[1].contribution === 14, 'Case 8: Section 2 contribution is 14%');
  assert(metrics.computedSections[2].contribution === 4, 'Case 8: Section 3 contribution is 4%');
  assert(metrics.computedSections[3].contribution === 20, 'Case 8: Section 4 contribution is 20%');
  assert(metrics.computedSections[4].contribution === 0, 'Case 8: Section 5 contribution is 0%');
}

// Case 9: Clamping: Total never exceeds 100% or Section Weight
{
  const overflowSections = [
    {
      id: 's1',
      active: true,
      tasks: [
        { progressPercentage: 150 }, // simulated bad data
      ]
    }
  ];
  const metrics = calculateDailyMetrics(overflowSections);
  assert(metrics.dailyProgress <= 100, 'Case 9: Daily progress never exceeds 100%');
  assert(metrics.computedSections[0].contribution <= 100, 'Case 9: Section contribution is clamped to section weight');
}

// Case 10: Motivational Tiers
{
  assert(getMotivationalTier(15) === 'tier_1', 'Case 10: 15% is tier_1');
  assert(getMotivationalTier(35) === 'tier_2', 'Case 10: 35% is tier_2');
  assert(getMotivationalTier(55) === 'tier_3', 'Case 10: 55% is tier_3');
  assert(getMotivationalTier(75) === 'tier_4', 'Case 10: 75% is tier_4');
  assert(getMotivationalTier(88) === 'tier_5', 'Case 10: 88% is tier_5');
  assert(getMotivationalTier(98) === 'tier_6', 'Case 10: 98% is tier_6');
}

// Case 11: Streak Calculations
{
  const history = {
    '2026-09-30': { dailyProgress: 75 },
    '2026-10-01': { dailyProgress: 80 },
    '2026-10-02': { dailyProgress: 90 },
  };
  const streaks = calculateStreaks(history, '2026-10-02');
  assert(streaks.currentStreak === 3, `Case 11: 3-day consecutive streak is 3 (got ${streaks.currentStreak})`);
  assert(streaks.longestStreak === 3, `Case 11: Longest streak is 3 (got ${streaks.longestStreak})`);
}

console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY!\n`);

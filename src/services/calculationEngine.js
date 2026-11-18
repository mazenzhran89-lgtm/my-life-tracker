/**
 * Pure Mathematical Engine for "My Life Tracker"
 * 
 * Rules:
 * 1. Number of active sections = N
 * 2. Section Weight = 100 / N (Exact floating point)
 * 3. Number of tasks in section = M
 * 4. Task Weight = Section Weight / M
 * 5. Task Contribution = Task Weight * (task.progressPercentage / 100)
 * 6. Section Progress = sum(task.progressPercentage) / M
 * 7. Section Contribution = min(Section Weight, sum(Task Contributions))
 * 8. Daily Progress = sum(Section Contributions), 0 <= Daily Progress <= 100
 * 9. Exact precision is maintained internally; rounded for display only.
 */

/**
 * Calculates the weight of a single section given the total count of active sections.
 * @param {number} activeSectionsCount 
 * @returns {number} Section weight in percentage (0 to 100)
 */
export function calculateSectionWeight(activeSectionsCount) {
  if (!activeSectionsCount || activeSectionsCount <= 0) return 0;
  return 100 / activeSectionsCount;
}

/**
 * Calculates the weight of a single task in a section.
 * @param {number} activeSectionsCount 
 * @param {number} tasksCount 
 * @returns {number} Task weight in percentage of the whole day (0 to 100)
 */
export function calculateTaskWeight(activeSectionsCount, tasksCount) {
  const secWeight = calculateSectionWeight(activeSectionsCount);
  if (!tasksCount || tasksCount <= 0) return 0;
  return secWeight / tasksCount;
}

/**
 * Calculates the internal progress percentage of a section (0% to 100%).
 * @param {Array<{progressPercentage: number}>} tasks 
 * @returns {number} Section completion rate from 0 to 100
 */
export function calculateSectionProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const total = tasks.reduce((sum, t) => sum + (Number(t.progressPercentage) || 0), 0);
  const avg = total / tasks.length;
  return Math.min(100, Math.max(0, avg));
}

/**
 * Calculates the contribution of a single section to the overall daily progress (0 to Section Weight).
 * @param {Object} section 
 * @param {number} activeSectionsCount 
 * @returns {number} Section contribution points
 */
export function calculateSectionContribution(section, activeSectionsCount) {
  if (!section || section.active === false) return 0;
  const secWeight = calculateSectionWeight(activeSectionsCount);
  const tasks = section.tasks || [];
  if (tasks.length === 0) return 0;

  const taskWeight = secWeight / tasks.length;
  const totalContribution = tasks.reduce((sum, task) => {
    const p = Math.min(100, Math.max(0, Number(task.progressPercentage) || 0));
    return sum + (taskWeight * (p / 100));
  }, 0);

  return Math.min(secWeight, Math.max(0, totalContribution));
}

/**
 * Calculates full daily statistics from an array of sections.
 * @param {Array<Object>} sections 
 * @returns {Object} Comprehensive calculation report
 */
export function calculateDailyMetrics(sections = []) {
  const activeSections = sections.filter(s => s.active !== false);
  const N = activeSections.length;
  const secWeight = calculateSectionWeight(N);

  let totalDailyProgress = 0;
  let totalCompletedTasks = 0;
  let totalTasksCount = 0;

  const computedSections = sections.map(section => {
    const isActive = section.active !== false;
    const tasks = section.tasks || [];
    const M = tasks.length;
    
    if (!isActive) {
      return {
        ...section,
        weight: 0,
        taskWeight: 0,
        progress: 0,
        contribution: 0,
        completedTasksCount: 0,
        totalTasksCount: M,
        computedTasks: tasks.map(t => ({
          ...t,
          weight: 0,
          contribution: 0
        }))
      };
    }

    const taskWeight = M > 0 ? secWeight / M : 0;
    let sectionCompletedTasks = 0;

    const computedTasks = tasks.map(task => {
      const p = Math.min(100, Math.max(0, Number(task.progressPercentage) || 0));
      if (p >= 100) sectionCompletedTasks += 1;
      const contribution = taskWeight * (p / 100);
      return {
        ...task,
        progressPercentage: p,
        weight: taskWeight,
        contribution
      };
    });

    const progress = calculateSectionProgress(tasks);
    const rawContribution = computedTasks.reduce((s, t) => s + t.contribution, 0);
    const contribution = Math.min(secWeight, Math.max(0, rawContribution));

    totalDailyProgress += contribution;
    totalCompletedTasks += sectionCompletedTasks;
    totalTasksCount += M;

    return {
      ...section,
      weight: secWeight,
      taskWeight,
      progress,
      contribution,
      completedTasksCount: sectionCompletedTasks,
      totalTasksCount: M,
      computedTasks
    };
  });

  const clampedDailyProgress = Math.min(100, Math.max(0, totalDailyProgress));
  const remainingTasks = Math.max(0, totalTasksCount - totalCompletedTasks);

  // Identify Best Section & Needs Attention
  let bestSection = null;
  let needsAttentionSection = null;

  const activeComputed = computedSections.filter(s => s.active !== false && (s.tasks?.length || 0) > 0);
  if (activeComputed.length > 0) {
    const sorted = [...activeComputed].sort((a, b) => b.progress - a.progress);
    bestSection = sorted[0];
    const lowest = sorted[sorted.length - 1];
    if (lowest.progress < 100) {
      needsAttentionSection = lowest;
    }
  }

  return {
    activeSectionsCount: N,
    sectionWeight: secWeight,
    dailyProgress: clampedDailyProgress,
    totalTasksCount,
    totalCompletedTasks,
    remainingTasks,
    computedSections,
    bestSection,
    needsAttentionSection
  };
}

/**
 * Formats a percentage value for display without losing internal precision.
 * e.g., 16.66667 -> "16.7%", 20 -> "20%", 0 -> "0%"
 * @param {number} val 
 * @param {number} [maxDecimals=1] 
 * @returns {string} Formatted string with '%'
 */
export function formatPercentage(val, maxDecimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  const num = Number(val);
  if (Math.abs(num - Math.round(num)) < 0.001) {
    return `${Math.round(num)}%`;
  }
  return `${Number(num.toFixed(maxDecimals))}%`;
}

/**
 * Returns motivational tier key based on progress percentage
 * @param {number} progress 
 * @returns {string} tier_1 ... tier_6
 */
export function getMotivationalTier(progress) {
  const p = Number(progress) || 0;
  if (p < 20) return 'tier_1';
  if (p < 40) return 'tier_2';
  if (p < 60) return 'tier_3';
  if (p < 80) return 'tier_4';
  if (p < 95) return 'tier_5';
  return 'tier_6';
}

/**
 * Retrieves a motivational quote matching the progress percentage and language.
 * Deterministic for a given date and progress tier, with variety.
 * @param {number} progress 
 * @param {Object} quotesDict 
 * @param {string} lang 
 * @param {string} [dateSeed=''] 
 * @returns {string} Quote string
 */
export function getMotivationalQuote(progress, quotesDict, lang = 'ar', dateSeed = '') {
  if (!quotesDict) return '';
  const tier = getMotivationalTier(progress);
  const tierQuotes = quotesDict[tier] || [];
  if (tierQuotes.length === 0) return '';

  let seedIndex = 0;
  if (dateSeed) {
    const hash = dateSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    seedIndex = hash % tierQuotes.length;
  } else {
    seedIndex = Math.floor(Math.random() * tierQuotes.length);
  }

  const selected = tierQuotes[seedIndex] || tierQuotes[0];
  return selected[lang] || selected.ar || selected.en || '';
}

/**
 * Formats a Date object to YYYY-MM-DD local string
 * @param {Date} date 
 * @returns {string}
 */
export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD string to Date at local noon
 * @param {string} dateStr 
 * @returns {Date}
 */
export function parseDateKey(dateStr) {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

/**
 * Calculates current streak and longest streak from historical daily records.
 * @param {Object} historyMap Keyed by 'YYYY-MM-DD' with { dailyProgress: number }
 * @param {string} todayDateStr 'YYYY-MM-DD'
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
export function calculateStreaks(historyMap = {}, todayDateStr) {
  const activeDates = Object.keys(historyMap)
    .filter(dStr => (historyMap[dStr]?.dailyProgress || 0) > 0)
    .sort();

  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let runningStreak = 0;
  let prevDateObj = null;

  for (const dStr of activeDates) {
    const currentObj = parseDateKey(dStr);
    if (!prevDateObj) {
      runningStreak = 1;
    } else {
      const diffMs = currentObj.getTime() - prevDateObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak += 1;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    prevDateObj = currentObj;
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  const refDateStr = todayDateStr || formatDateKey(new Date());
  const todayObj = parseDateKey(refDateStr);

  let currentStreak = 0;
  const todayProgress = historyMap[refDateStr]?.dailyProgress || 0;

  const pointer = new Date(todayObj);
  if (todayProgress > 0) {
    // Count backwards starting from today
    while (true) {
      const key = formatDateKey(pointer);
      if ((historyMap[key]?.dailyProgress || 0) > 0) {
        currentStreak += 1;
        pointer.setDate(pointer.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    // Today not done yet, check if streak was active up to yesterday
    pointer.setDate(pointer.getDate() - 1);
    while (true) {
      const key = formatDateKey(pointer);
      if ((historyMap[key]?.dailyProgress || 0) > 0) {
        currentStreak += 1;
        pointer.setDate(pointer.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak)
  };
}

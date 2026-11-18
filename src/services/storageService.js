import { INITIAL_SECTIONS, DEFAULT_SETTINGS, DEFAULT_MOTIVATIONAL_QUOTES } from '../constants/defaultData.js';
import { calculateDailyMetrics, formatDateKey } from './calculationEngine.js';

const STORAGE_KEYS = {
  MASTER_SECTIONS: 'mlt_master_sections_v1',
  HISTORY: 'mlt_daily_history_v1',
  SETTINGS: 'mlt_settings_v1',
  MOTIVATIONAL_QUOTES: 'mlt_quotes_v1'
};

/**
 * Deep clone helper
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Loads master template sections from LocalStorage or seeds default
 * @returns {Array<Object>}
 */
export function loadMasterSections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MASTER_SECTIONS);
    if (!raw) {
      const initial = deepClone(INITIAL_SECTIONS);
      saveMasterSections(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return deepClone(INITIAL_SECTIONS);
  } catch (e) {
    console.error('Error loading master sections:', e);
    return deepClone(INITIAL_SECTIONS);
  }
}

/**
 * Saves master template sections to LocalStorage
 * @param {Array<Object>} sections 
 */
export function saveMasterSections(sections) {
  try {
    localStorage.setItem(STORAGE_KEYS.MASTER_SECTIONS, JSON.stringify(sections));
  } catch (e) {
    console.error('Error saving master sections:', e);
  }
}

/**
 * Loads settings from LocalStorage
 * @returns {Object}
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return deepClone(DEFAULT_SETTINGS);
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading settings:', e);
    return deepClone(DEFAULT_SETTINGS);
  }
}

/**
 * Saves settings to LocalStorage
 * @param {Object} settings 
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

/**
 * Loads motivational quotes from LocalStorage
 * @returns {Object}
 */
export function loadMotivationalQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOTIVATIONAL_QUOTES);
    if (!raw) {
      saveMotivationalQuotes(DEFAULT_MOTIVATIONAL_QUOTES);
      return deepClone(DEFAULT_MOTIVATIONAL_QUOTES);
    }
    return { ...DEFAULT_MOTIVATIONAL_QUOTES, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading quotes:', e);
    return deepClone(DEFAULT_MOTIVATIONAL_QUOTES);
  }
}

/**
 * Saves motivational quotes to LocalStorage
 * @param {Object} quotes 
 */
export function saveMotivationalQuotes(quotes) {
  try {
    localStorage.setItem(STORAGE_KEYS.MOTIVATIONAL_QUOTES, JSON.stringify(quotes));
  } catch (e) {
    console.error('Error saving quotes:', e);
  }
}

/**
 * Loads all history records map
 * @returns {Object} Keyed by YYYY-MM-DD
 */
export function loadHistoryMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Error loading history:', e);
    return {};
  }
}

/**
 * Saves full history map
 * @param {Object} historyMap 
 */
export function saveHistoryMap(historyMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyMap));
  } catch (e) {
    console.error('Error saving history map:', e);
  }
}

/**
 * Retrieves snapshot for a given date. If it doesn't exist, initializes from master sections.
 * @param {string} dateStr 'YYYY-MM-DD'
 * @param {Array<Object>} [currentMasterSections]
 * @returns {Object} Daily Record Snapshot
 */
export function getOrCreateDayRecord(dateStr, currentMasterSections = null) {
  const historyMap = loadHistoryMap();
  if (historyMap[dateStr]) {
    return historyMap[dateStr];
  }

  // Create fresh snapshot cloned from master template
  const master = currentMasterSections || loadMasterSections();
  const snapshotSections = master.map(sec => ({
    ...deepClone(sec),
    tasks: (sec.tasks || []).map(t => ({
      ...deepClone(t),
      progressPercentage: 0
    }))
  }));

  const metrics = calculateDailyMetrics(snapshotSections);
  const newRecord = {
    date: dateStr,
    sections: snapshotSections,
    dailyProgress: metrics.dailyProgress,
    lastModified: Date.now(),
    notes: ''
  };

  historyMap[dateStr] = newRecord;
  saveHistoryMap(historyMap);
  return newRecord;
}

/**
 * Saves an updated day record and recalculates its snapshot metrics
 * @param {Object} dayRecord 
 * @returns {Object} Updated dayRecord with recalculated metrics
 */
export function saveDayRecord(dayRecord) {
  if (!dayRecord || !dayRecord.date) return null;
  const historyMap = loadHistoryMap();
  
  const metrics = calculateDailyMetrics(dayRecord.sections || []);
  const updatedRecord = {
    ...dayRecord,
    dailyProgress: metrics.dailyProgress,
    lastModified: Date.now()
  };

  historyMap[dayRecord.date] = updatedRecord;
  saveHistoryMap(historyMap);
  return updatedRecord;
}

/**
 * Validates and exports all application data as a JSON blob
 * @returns {string} JSON string
 */
export function exportDataAsJSON() {
  const data = {
    version: '1.0',
    exportTimestamp: new Date().toISOString(),
    settings: loadSettings(),
    masterSections: loadMasterSections(),
    history: loadHistoryMap(),
    quotes: loadMotivationalQuotes()
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Validates and imports JSON data string
 * @param {string} jsonString 
 * @returns {{ success: boolean, error?: string, counts?: Object }}
 */
export function importDataFromJSON(jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, error: 'Empty or invalid JSON payload' };
    }

    const data = JSON.parse(jsonString);

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'JSON root must be an object' };
    }

    if (data.masterSections && !Array.isArray(data.masterSections)) {
      return { success: false, error: 'Invalid masterSections format' };
    }

    if (data.history && typeof data.history !== 'object') {
      return { success: false, error: 'Invalid history format' };
    }

    if (data.settings && typeof data.settings === 'object') {
      saveSettings(data.settings);
    }

    if (Array.isArray(data.masterSections)) {
      saveMasterSections(data.masterSections);
    }

    if (data.history && typeof data.history === 'object') {
      saveHistoryMap(data.history);
    }

    if (data.quotes && typeof data.quotes === 'object') {
      saveMotivationalQuotes(data.quotes);
    }

    return {
      success: true,
      counts: {
        sections: data.masterSections?.length || 0,
        days: Object.keys(data.history || {}).length
      }
    };
  } catch (e) {
    return { success: false, error: e.message || 'Corrupt JSON syntax' };
  }
}

/**
 * Resets all user data to fresh defaults
 */
export function resetAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MASTER_SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.MOTIVATIONAL_QUOTES);
    
    // Re-seed
    saveMasterSections(deepClone(INITIAL_SECTIONS));
    saveSettings(deepClone(DEFAULT_SETTINGS));
    saveMotivationalQuotes(deepClone(DEFAULT_MOTIVATIONAL_QUOTES));
    saveHistoryMap({});
    return true;
  } catch (e) {
    console.error('Error resetting data:', e);
    return false;
  }
}

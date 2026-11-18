import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { AppContext } from './AppContextObject.js';
export { useApp } from './useApp.js';
import {
  loadMasterSections,
  saveMasterSections,
  loadSettings,
  saveSettings,
  loadHistoryMap,
  saveHistoryMap,
  loadMotivationalQuotes,
  getOrCreateDayRecord,
  saveDayRecord,
  exportDataAsJSON,
  importDataFromJSON,
  resetAllData,
  deepClone
} from '../services/storageService.js';
import {
  calculateDailyMetrics,
  calculateStreaks,
  formatDateKey,
  parseDateKey,
  getMotivationalQuote
} from '../services/calculationEngine.js';
import { translations, getLocalizedText } from '../locales/index.js';

export function AppProvider({ children }) {
  const [settings, setSettingsState] = useState(() => loadSettings());
  const [masterSections, setMasterSectionsState] = useState(() => loadMasterSections());
  const [historyMap, setHistoryMapState] = useState(() => loadHistoryMap());
  const [quotes, setQuotesState] = useState(() => loadMotivationalQuotes());

  // Today's real local date string
  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const [selectedDateStr, setSelectedDateStr] = useState(todayKey);
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'history' | 'insights' | 'settings'
  const [toasts, setToasts] = useState([]);

  // Active day record for the selected date
  const [currentDayRecord, setCurrentDayRecord] = useState(() => {
    return getOrCreateDayRecord(todayKey, masterSections);
  });

  // When selectedDateStr or masterSections change, ensure currentDayRecord is loaded
  useEffect(() => {
    const rec = getOrCreateDayRecord(selectedDateStr, masterSections);
    setCurrentDayRecord(rec);
  }, [selectedDateStr]);

  // Sync theme changes to HTML root
  useEffect(() => {
    const applyTheme = (t) => {
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    applyTheme(settings.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (settings.theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [settings.theme]);

  // Sync language and text direction to HTML root
  useEffect(() => {
    const root = document.documentElement;
    const lang = settings.language || 'ar';
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [settings.language]);

  // Toast helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Calculate daily metrics dynamically for current active day record
  const dailyMetrics = useMemo(() => {
    return calculateDailyMetrics(currentDayRecord?.sections || []);
  }, [currentDayRecord]);

  // Calculate streaks across entire history map
  const streaks = useMemo(() => {
    return calculateStreaks(historyMap, todayKey);
  }, [historyMap, todayKey]);

  // Current motivational quote
  const motivationalQuote = useMemo(() => {
    return getMotivationalQuote(
      dailyMetrics.dailyProgress,
      quotes,
      settings.language,
      selectedDateStr
    );
  }, [dailyMetrics.dailyProgress, quotes, settings.language, selectedDateStr]);

  // Helper to commit day changes
  const updateCurrentDaySections = (newSections) => {
    const updated = {
      ...currentDayRecord,
      sections: newSections
    };
    const saved = saveDayRecord(updated);
    setCurrentDayRecord(saved);
    setHistoryMapState(loadHistoryMap());
  };

  // Toggle task binary (0% <-> 100%)
  const toggleTask = (sectionId, taskId) => {
    if (!currentDayRecord) return;
    let becameCompleted = false;

    const newSections = currentDayRecord.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const newTasks = (sec.tasks || []).map(task => {
        if (task.id !== taskId) return task;
        const nextProgress = task.progressPercentage >= 100 ? 0 : 100;
        if (nextProgress === 100) becameCompleted = true;
        return { ...task, progressPercentage: nextProgress };
      });
      return { ...sec, tasks: newTasks };
    });

    updateCurrentDaySections(newSections);

    const prevProgress = dailyMetrics.dailyProgress;
    const newMetrics = calculateDailyMetrics(newSections);

    if (becameCompleted && newMetrics.dailyProgress >= 100 && prevProgress < 100) {
      // Trigger festive confetti on 100% completion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F7959', '#73A77F', '#C06044', '#B88536', '#547487']
        });
      } catch (e) {
        // ignore if not supported
      }
      addToast(getLocalizedText('congratulations100', settings.language), 'success');
    } else if (becameCompleted) {
      addToast(getLocalizedText('toastTaskCompleted', settings.language), 'success');
    }
  };

  // Set granular task percentage (0, 10, 30, 50, 70, 100, etc.)
  const setTaskProgress = (sectionId, taskId, percentage) => {
    if (!currentDayRecord) return;
    const clamped = Math.min(100, Math.max(0, Number(percentage) || 0));

    const newSections = currentDayRecord.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const newTasks = (sec.tasks || []).map(task => {
        if (task.id !== taskId) return task;
        return { ...task, progressPercentage: clamped };
      });
      return { ...sec, tasks: newTasks };
    });

    updateCurrentDaySections(newSections);

    if (clamped >= 100) {
      const newMetrics = calculateDailyMetrics(newSections);
      if (newMetrics.dailyProgress >= 100) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4F7959', '#73A77F', '#C06044', '#B88536', '#547487']
          });
        } catch (e) {}
      }
      addToast(getLocalizedText('toastTaskCompleted', settings.language), 'success');
    }
  };

  // Toggle section active/inactive for today
  const toggleSectionActive = (sectionId) => {
    if (!currentDayRecord) return;
    const newSections = currentDayRecord.sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, active: sec.active === false ? true : false };
    });
    updateCurrentDaySections(newSections);
    addToast(getLocalizedText('toastSectionUpdated', settings.language), 'info');
  };

  // Add new section to master template and today
  const addSection = (sectionData) => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: sectionData.title || { ar: 'قسم جديد', en: 'New Section' },
      description: sectionData.description || { ar: '', en: '' },
      icon: sectionData.icon || 'Sparkles',
      color: sectionData.color || 'sage',
      active: true,
      order: masterSections.length,
      tasks: (sectionData.tasks || []).map((t, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        title: t.title || { ar: 'مهمة جديدة', en: 'New Task' },
        description: t.description || { ar: '', en: '' },
        progressPercentage: 0
      }))
    };

    const newMaster = [...masterSections, newSection];
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    // Also add to today's active record
    const updatedTodaySections = [...(currentDayRecord?.sections || []), newSection];
    updateCurrentDaySections(updatedTodaySections);

    addToast(getLocalizedText('toastSectionAdded', settings.language), 'success');
    return newSection;
  };

  // Edit section in master template & optionally current day
  const updateSection = (sectionId, updatedFields) => {
    const newMaster = masterSections.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, ...updatedFields };
    });
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    if (currentDayRecord) {
      const newTodaySections = currentDayRecord.sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          ...updatedFields,
          // Preserve existing task progress percentages
          tasks: s.tasks
        };
      });
      updateCurrentDaySections(newTodaySections);
    }

    addToast(getLocalizedText('toastSectionUpdated', settings.language), 'success');
  };

  // Delete section completely
  const deleteSection = (sectionId) => {
    const newMaster = masterSections.filter(s => s.id !== sectionId);
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    if (currentDayRecord) {
      const newTodaySections = currentDayRecord.sections.filter(s => s.id !== sectionId);
      updateCurrentDaySections(newTodaySections);
    }

    addToast(getLocalizedText('toastSectionDeleted', settings.language), 'info');
  };

  // Add task to section
  const addTask = (sectionId, taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || { ar: 'مهمة جديدة', en: 'New Task' },
      description: taskData.description || { ar: '', en: '' },
      progressPercentage: 0
    };

    // Update master
    const newMaster = masterSections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, tasks: [...(sec.tasks || []), newTask] };
    });
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    // Update current day
    if (currentDayRecord) {
      const newTodaySections = currentDayRecord.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return { ...sec, tasks: [...(sec.tasks || []), newTask] };
      });
      updateCurrentDaySections(newTodaySections);
    }

    addToast(getLocalizedText('toastSaved', settings.language), 'success');
  };

  // Edit task
  const updateTask = (sectionId, taskId, updatedFields) => {
    // Update master
    const newMaster = masterSections.map(sec => {
      if (sec.id !== sectionId) return sec;
      const tasks = (sec.tasks || []).map(t => {
        if (t.id !== taskId) return t;
        return { ...t, ...updatedFields };
      });
      return { ...sec, tasks };
    });
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    // Update current day
    if (currentDayRecord) {
      const newTodaySections = currentDayRecord.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const tasks = (sec.tasks || []).map(t => {
          if (t.id !== taskId) return t;
          return { ...t, ...updatedFields };
        });
        return { ...sec, tasks };
      });
      updateCurrentDaySections(newTodaySections);
    }

    addToast(getLocalizedText('toastSaved', settings.language), 'success');
  };

  // Delete task
  const deleteTask = (sectionId, taskId) => {
    // Update master
    const newMaster = masterSections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, tasks: (sec.tasks || []).filter(t => t.id !== taskId) };
    });
    setMasterSectionsState(newMaster);
    saveMasterSections(newMaster);

    // Update current day
    if (currentDayRecord) {
      const newTodaySections = currentDayRecord.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return { ...sec, tasks: (sec.tasks || []).filter(t => t.id !== taskId) };
      });
      updateCurrentDaySections(newTodaySections);
    }

    addToast(getLocalizedText('toastSaved', settings.language), 'info');
  };

  // Reorder sections
  const reorderSections = (orderedSections) => {
    const updated = orderedSections.map((sec, idx) => ({ ...sec, order: idx }));
    setMasterSectionsState(updated);
    saveMasterSections(updated);

    if (currentDayRecord) {
      const updatedToday = orderedSections.map((sec, idx) => {
        const existing = currentDayRecord.sections.find(s => s.id === sec.id);
        return existing ? { ...existing, order: idx } : { ...sec, order: idx };
      });
      updateCurrentDaySections(updatedToday);
    }
  };

  // Update Settings
  const updateSettings = (newSettingsFields) => {
    const updated = { ...settings, ...newSettingsFields };
    setSettingsState(updated);
    saveSettings(updated);
  };

  // Export JSON Backup
  const exportBackup = () => {
    try {
      const jsonStr = exportDataAsJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-life-tracker-backup-${formatDateKey(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(getLocalizedText('toastExportSuccess', settings.language), 'success');
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  // Import JSON Backup
  const importBackup = (jsonString) => {
    const result = importDataFromJSON(jsonString);
    if (result.success) {
      setSettingsState(loadSettings());
      setMasterSectionsState(loadMasterSections());
      const newHistory = loadHistoryMap();
      setHistoryMapState(newHistory);
      const rec = getOrCreateDayRecord(selectedDateStr, loadMasterSections());
      setCurrentDayRecord(rec);
      addToast(getLocalizedText('importSuccess', settings.language), 'success');
      return true;
    } else {
      addToast(`${getLocalizedText('importError', settings.language)}: ${result.error}`, 'error');
      return false;
    }
  };

  // Reset System
  const resetSystem = () => {
    resetAllData();
    setSettingsState(loadSettings());
    const freshMaster = loadMasterSections();
    setMasterSectionsState(freshMaster);
    setHistoryMapState({});
    const freshToday = getOrCreateDayRecord(todayKey, freshMaster);
    setSelectedDateStr(todayKey);
    setCurrentDayRecord(freshToday);
    addToast(getLocalizedText('resetSuccess', settings.language), 'success');
  };

  const t = (key) => getLocalizedText(key, settings.language);

  return (
    <AppContext.Provider
      value={{
        // State
        activeTab,
        setActiveTab,
        selectedDateStr,
        setSelectedDateStr,
        todayKey,
        settings,
        updateSettings,
        masterSections,
        historyMap,
        currentDayRecord,
        dailyMetrics,
        streaks,
        motivationalQuote,
        toasts,
        t,

        // Actions
        toggleTask,
        setTaskProgress,
        toggleSectionActive,
        addSection,
        updateSection,
        deleteSection,
        addTask,
        updateTask,
        deleteTask,
        reorderSections,
        exportBackup,
        importBackup,
        resetSystem,
        addToast,
        setCurrentDaySectionsDirectly: updateCurrentDaySections
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


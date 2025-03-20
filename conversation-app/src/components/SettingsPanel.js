import React, { useState } from 'react';

const SettingsPanel = ({ initialSettings = {}, onSave }) => {
  // Default settings
  const defaultSettings = {
    appearance: {
      theme: initialSettings.appearance?.theme || 'light',
      fontSize: initialSettings.appearance?.fontSize || 'medium',
      colorBlindMode: initialSettings.appearance?.colorBlindMode || false,
      highContrastMode: initialSettings.appearance?.highContrastMode || false
    },
    assessments: {
      autoSaveInterval: initialSettings.assessments?.autoSaveInterval || 5,
      defaultAssessmentType: initialSettings.assessments?.defaultAssessmentType || 'preschool',
      showCompletionProgress: initialSettings.assessments?.showCompletionProgress || true,
      showDomainDescriptions: initialSettings.assessments?.showDomainDescriptions || true
    },
    data: {
      dataExportFormat: initialSettings.data?.dataExportFormat || 'pdf',
      dataRetentionPeriod: initialSettings.data?.dataRetentionPeriod || 12,
      autoBackup: initialSettings.data?.autoBackup || true,
      backupFrequency: initialSettings.data?.backupFrequency || 'weekly'
    },
    accessibility: {
      screenReader: initialSettings.accessibility?.screenReader || false,
      keyboardNavigation: initialSettings.accessibility?.keyboardNavigation || true,
      animationReduced: initialSettings.accessibility?.animationReduced || false
    }
  };

  // State variables
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('appearance');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [category, setting] = name.split('.');

    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: type === 'checkbox' ? checked :
          type === 'number' ? parseInt(value, 10) :
            value
      }
    });
  };

  // Save settings
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave(settings);
      }
      setSaving(false);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Reset settings to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(defaultSettings);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Application Settings</h2>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'appearance' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'assessments' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('assessments')}
        >
          Assessments
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'data' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('data')}
        >
          Data Management
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'accessibility' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('accessibility')}
        >
          Accessibility
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="p-6">
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance Settings</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                  <select
                    id="theme"
                    name="appearance.theme"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.appearance.theme}
                    onChange={handleChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size</label>
                  <select
                    id="fontSize"
                    name="appearance.fontSize"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.appearance.fontSize}
                    onChange={handleChange}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="colorBlindMode"
                    name="appearance.colorBlindMode"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.appearance.colorBlindMode}
                    onChange={handleChange}
                  />
                  <label htmlFor="colorBlindMode" className="ml-2 block text-sm text-gray-700">
                    Color Blind Mode
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="highContrastMode"
                    name="appearance.highContrastMode"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.appearance.highContrastMode}
                    onChange={handleChange}
                  />
                  <label htmlFor="highContrastMode" className="ml-2 block text-sm text-gray-700">
                    High Contrast Mode
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Settings */}
          {activeTab === 'assessments' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment Settings</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="autoSaveInterval" className="block text-sm font-medium text-gray-700">
                    Auto-Save Interval (minutes)
                  </label>
                  <input
                    id="autoSaveInterval"
                    name="assessments.autoSaveInterval"
                    type="number"
                    min="1"
                    max="30"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.assessments.autoSaveInterval}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="defaultAssessmentType" className="block text-sm font-medium text-gray-700">
                    Default Assessment Type
                  </label>
                  <select
                    id="defaultAssessmentType"
                    name="assessments.defaultAssessmentType"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.assessments.defaultAssessmentType}
                    onChange={handleChange}
                  >
                    <option value="preschool">Preschool/TK</option>
                    <option value="kindergarten">Kindergarten</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="showCompletionProgress"
                    name="assessments.showCompletionProgress"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.assessments.showCompletionProgress}
                    onChange={handleChange}
                  />
                  <label htmlFor="showCompletionProgress" className="ml-2 block text-sm text-gray-700">
                    Show Completion Progress
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="showDomainDescriptions"
                    name="assessments.showDomainDescriptions"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.assessments.showDomainDescriptions}
                    onChange={handleChange}
                  />
                  <label htmlFor="showDomainDescriptions" className="ml-2 block text-sm text-gray-700">
                    Show Domain Descriptions
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Settings */}
          {activeTab === 'data' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management Settings</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="dataExportFormat" className="block text-sm font-medium text-gray-700">
                    Default Export Format
                  </label>
                  <select
                    id="dataExportFormat"
                    name="data.dataExportFormat"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.data.dataExportFormat}
                    onChange={handleChange}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dataRetentionPeriod" className="block text-sm font-medium text-gray-700">
                    Data Retention Period (months)
                  </label>
                  <input
                    id="dataRetentionPeriod"
                    name="data.dataRetentionPeriod"
                    type="number"
                    min="1"
                    max="60"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.data.dataRetentionPeriod}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="autoBackup"
                    name="data.autoBackup"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.data.autoBackup}
                    onChange={handleChange}
                  />
                  <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                    Automatic Backup
                  </label>
                </div>

                <div>
                  <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    id="backupFrequency"
                    name="data.backupFrequency"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={settings.data.backupFrequency}
                    onChange={handleChange}
                    disabled={!settings.data.autoBackup}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Accessibility Settings */}
          {activeTab === 'accessibility' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibility Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="screenReader"
                    name="accessibility.screenReader"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.accessibility.screenReader}
                    onChange={handleChange}
                  />
                  <label htmlFor="screenReader" className="ml-2 block text-sm text-gray-700">
                    Screen Reader Support
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="keyboardNavigation"
                    name="accessibility.keyboardNavigation"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.accessibility.keyboardNavigation}
                    onChange={handleChange}
                  />
                  <label htmlFor="keyboardNavigation" className="ml-2 block text-sm text-gray-700">
                    Enhanced Keyboard Navigation
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="animationReduced"
                    name="accessibility.animationReduced"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={settings.accessibility.animationReduced}
                    onChange={handleChange}
                  />
                  <label htmlFor="animationReduced" className="ml-2 block text-sm text-gray-700">
                    Reduced Animations
                  </label>
                </div>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md text-sm">
              Settings saved successfully!
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              onClick={handleReset}
            >
              Reset to Defaults
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPanel; 
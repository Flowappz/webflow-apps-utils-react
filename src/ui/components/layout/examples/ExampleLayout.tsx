import { useEffect, useState } from 'react';

import { useAppContext } from '../../../providers';

import { CheckCircleIcon, CodeIcon, InfoIcon, SettingsIcon } from '../../../icons';
import { Button } from '../../button';
import { ColorPicker } from '../../color-picker';
import { Input } from '../../input';
import { Section } from '../../section';
import { Switch } from '../../switch';
import { Text } from '../../text';
import { Tooltip } from '../../tooltip';
import Layout from '../Layout';
import type { LayoutNotification, LayoutTab } from '../types';

import './ExampleLayout.css';

// Dummy data for 2 tabs: settings and code
const dummyTabs: LayoutTab[] = [
  { path: 'settings', name: 'Settings', icon: SettingsIcon, isActive: false },
  { path: 'code', name: 'Code', icon: CodeIcon, isActive: false },
];

export const ExampleLayout = () => {
  // Internal state for configuration
  const [activeTab, setActiveTab] = useState('settings');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showTabs, setShowTabs] = useState(true);
  const [showPreviewBar, setShowPreviewBar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showEditModeMessage, setShowEditModeMessage] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('239px');
  const [footerSize, setFooterSize] = useState<'normal' | 'large'>('normal');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(true);
  const [inputValue, setInputValue] = useState('');

  // Get app context and keep showEditModeMessage in sync
  const appContext = useAppContext();

  // Subscribe to context changes to keep local showEditModeMessage in sync
  useEffect(() => {
    const unsubscribe = appContext.subscribe(
      (data: { editMode?: boolean } | undefined | null) => {
        if (data?.editMode !== undefined) {
          setShowEditModeMessage((current) =>
            data.editMode !== current ? Boolean(data.editMode) : current
          );
        }
      }
    );
    return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext]);

  // Footer button handlers
  function handleSaveClick() {
    console.log('Save clicked');
  }

  function handleApplyClick() {
    console.log('Apply clicked');
  }

  // Create tabs with active state
  const tabs = dummyTabs.map((tab) => ({
    ...tab,
    isActive: tab.path === activeTab,
  }));

  // Create notifications
  const notifications: LayoutNotification[] = showNotifications
    ? [
        {
          path: activeTab,
          success: notificationSuccess,
          message: notificationSuccess
            ? 'Configuration saved successfully'
            : 'Error in configuration',
          showNotification: true,
        },
      ]
    : [];

  // Tab switching function
  function switchTab(tabPath: string) {
    setActiveTab(tabPath);
    console.log('Switched to tab:', tabPath);
  }

  useEffect(() => {
    appContext.set({
      editMode: true,
      repairMode: false,
      title: 'Example',
      configurator: {
        configurator: null,
        configuratorCache: null,
        hasChanged: false,
        watchOptions: { watchAll: true, debounceMs: 50 },
      },
    });
    // Initialize local showEditModeMessage state
    setShowEditModeMessage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="example-container">
      <div className="configurator-panel">
        <div className="config-panel">
          <div className="config-header">
            <Text fontSize="xs" fontWeight="bold" fontColor="var(--text1)">
              Config
            </Text>
          </div>

          <div className="config-content">
            <div className="config-section">
              <div className="control-group">
                <label htmlFor="active-tab" className="control-label">
                  Active Tab
                </label>
                <select
                  id="active-tab"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="select-input"
                >
                  <option value="settings">Settings</option>
                  <option value="code">Code</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="sidebar-width" className="control-label">
                  Sidebar Width
                </label>
                <select
                  id="sidebar-width"
                  value={sidebarWidth}
                  onChange={(e) => setSidebarWidth(e.target.value)}
                  className="select-input"
                >
                  <option value="239px">239px</option>
                  <option value="270px">270px</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="footer-size" className="control-label">
                  Footer Size
                </label>
                <select
                  id="footer-size"
                  value={footerSize}
                  onChange={(e) => setFooterSize(e.target.value as 'normal' | 'large')}
                  className="select-input"
                >
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="config-section">
              <div className="toggles-list">
                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showSidebar}
                    onChange={(e) => setShowSidebar(e.target.checked)}
                    id="show-sidebar"
                    className="checkbox-input"
                  />
                  <label htmlFor="show-sidebar" className="checkbox-label">
                    Sidebar
                  </label>
                </div>

                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showTabs}
                    onChange={(e) => setShowTabs(e.target.checked)}
                    id="show-tabs"
                    className="checkbox-input"
                  />
                  <label htmlFor="show-tabs" className="checkbox-label">
                    Tabs
                  </label>
                </div>

                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showPreviewBar}
                    onChange={(e) => setShowPreviewBar(e.target.checked)}
                    id="show-preview"
                    className="checkbox-input"
                  />
                  <label htmlFor="show-preview" className="checkbox-label">
                    Preview
                  </label>
                </div>

                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showFooter}
                    onChange={(e) => setShowFooter(e.target.checked)}
                    id="show-footer"
                    className="checkbox-input"
                  />
                  <label htmlFor="show-footer" className="checkbox-label">
                    Footer
                  </label>
                </div>

                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showEditModeMessage}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowEditModeMessage(checked);
                      const current = appContext.get();
                      appContext.set({ ...current, editMode: checked });
                    }}
                    id="edit-mode"
                    className="checkbox-input"
                  />
                  <label htmlFor="edit-mode" className="checkbox-label">
                    Edit Mode
                  </label>
                </div>

                <div className="toggle-control">
                  <input
                    type="checkbox"
                    checked={showNotifications}
                    onChange={(e) => setShowNotifications(e.target.checked)}
                    id="show-notifications"
                    className="checkbox-input"
                  />
                  <label htmlFor="show-notifications" className="checkbox-label">
                    Notify
                  </label>
                </div>

                {showNotifications && (
                  <div className="toggle-control">
                    <input
                      type="checkbox"
                      checked={notificationSuccess}
                      onChange={(e) => setNotificationSuccess(e.target.checked)}
                      id="notification-success"
                      className="checkbox-input"
                    />
                    <label htmlFor="notification-success" className="checkbox-label">
                      Success
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-preview">
        <Layout
          activeTab={activeTab}
          tabs={tabs}
          switchTab={switchTab}
          formKey="dummy-layout"
          showEditModeMessage={showEditModeMessage}
          showFooter={showFooter}
          showSidebar={showSidebar}
          showTabs={showTabs}
          showPreviewBar={showPreviewBar}
          sidebarWidth={sidebarWidth}
          footerSize={footerSize}
          notifications={notifications}
          containerMode={true}
          sidebar={
            activeTab === 'settings' ? (
              <Text fontSize="md" fontWeight="normal">
                App Settings sidebar content
              </Text>
            ) : activeTab === 'code' ? (
              <Text fontSize="md" fontWeight="normal">
                Code Editor sidebar content
              </Text>
            ) : null
          }
          main={
            activeTab === 'settings' ? (
              <>
                <Text fontSize="xl" fontWeight="normal">
                  Application Settings Tab content
                </Text>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Switch />
                  <Text
                    fontSize="md"
                    fontWeight="normal"
                    icon={InfoIcon}
                    tooltip={{
                      tooltipIcon: InfoIcon,
                      message: 'This is a tooltip',
                    }}
                  >
                    I am a Text with a tooltip
                  </Text>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="cms">CMS</Button>
                  <Button variant="primary" icon={InfoIcon} text="Button with icon" />
                  <Input
                    pill="blue"
                    value={inputValue}
                    oninput={(value: string) => {
                      setInputValue(value);
                    }}
                    placeholder="Type here..."
                    width="130px"
                  />

                  <ColorPicker
                    color="#8C4C4C"
                    oncolorchange={(color) => {
                      console.log('Color:', color);
                    }}
                  />

                  <Input
                    value="Error input"
                    invalid={true}
                    alert={{
                      type: 'error',
                      message: 'This field contains an error',
                    }}
                    width="130px"
                  />
                  <Input
                    value="Success input"
                    alert={{
                      type: 'success',
                      message: 'Input is valid!',
                    }}
                    width="130px"
                  />
                  <Input
                    value="Warning input"
                    alert={{
                      type: 'warning',
                      message: 'Please review this input',
                    }}
                    width="130px"
                  />
                  <Input
                    placeholder="Info tooltip"
                    alert={{
                      type: 'info',
                      message: 'Additional information about this field',
                    }}
                    width="130px"
                  />

                  <Tooltip
                    onshow={(value: boolean) => console.log('Tooltip shown:', value)}
                    onclose={(value: boolean) => console.log('Tooltip closed:', value)}
                    target={<button>Hover me</button>}
                    tooltip={<div>Custom tooltip content here!</div>}
                  />

                  <Tooltip
                    onshow={(value: boolean) => console.log('Tooltip shown:', value)}
                    onclose={(value: boolean) => console.log('Tooltip closed:', value)}
                    listener="click"
                    listenerout="click"
                    stopPropagation={false}
                    target={<button>Click me</button>}
                    tooltip={
                      <div className="click-tests">
                        <Text link onclick={() => console.log('Tooltip clicked')}>
                          Click me
                        </Text>
                        <Text link onclick={() => console.log('Tooltip another click')}>
                          Another click me
                        </Text>
                      </div>
                    }
                  />
                </div>
                <Section clickable disabled>
                  <Text fontSize="md" fontWeight="normal">
                    Clickable disabled
                  </Text>
                </Section>
                <Section clickable>
                  <Text fontSize="md" fontWeight="normal">
                    Clickable enabled
                  </Text>
                </Section>
              </>
            ) : activeTab === 'code' ? (
              <Text fontSize="xl" fontWeight="normal">
                Code Editor Tab content
              </Text>
            ) : null
          }
          previewBar={
            <Text fontSize="md" fontWeight="normal">
              Preview bar content
            </Text>
          }
          footer={
            <>
              <Button
                variant="secondary"
                icon={CheckCircleIcon}
                onclick={handleSaveClick}
                disabled={showEditModeMessage}
              >
                Save Changes
              </Button>
              <Button variant="primary" onclick={handleApplyClick} disabled={showEditModeMessage}>
                Apply Settings
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default ExampleLayout;

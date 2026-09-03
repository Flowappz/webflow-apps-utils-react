import { useState } from 'react';

import { GlobalProvider, useAppContext, useConfiguratorContext, useFormContext } from './index';
import './GlobalProviderDemo.css';

// Demo configurator type
type DemoConfigType = {
  theme: 'light' | 'dark';
  layout: 'grid' | 'list';
  itemsPerPage: number;
};

const initialContexts = {
  app: {
    editMode: false,
    repairMode: false,
    title: 'GlobalProvider Demo',
    configurator: {
      configurator: { theme: 'light', layout: 'grid', itemsPerPage: 10 },
      configuratorCache: { theme: 'light', layout: 'grid', itemsPerPage: 10 },
      hasChanged: false,
      watchOptions: { watchAll: true, watchKeys: [], debounceMs: 100 },
    },
  },
  form: {
    formKey: 'demo-form',
    formUpdateKey: null,
  },
};

function DemoContent() {
  const appContext = useAppContext<DemoConfigType>();
  const formContext = useFormContext();
  const configuratorContext = useConfiguratorContext<DemoConfigType>();

  // Simple demo state management
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function forceRefresh() {
    setRefreshTrigger((t) => t + 1);
  }

  const appData = appContext.get();
  const formData = formContext.get();
  const configuratorData = configuratorContext.configurator;
  const hasChanged = configuratorContext.hasChanged;

  return (
    <div className="demo-content" key={refreshTrigger}>
      <h3>GlobalProvider Demo</h3>

      <div className="context-section">
        <h4>App Context</h4>
        <p>
          Edit Mode: <strong>{appData?.editMode ? 'ON' : 'OFF'}</strong>
        </p>
        <p>
          Title: <strong>{appData?.title || 'N/A'}</strong>
        </p>
        <button
          onClick={() => {
            const current = appContext.get();
            appContext.set({
              ...current,
              editMode: !current?.editMode,
            });
            forceRefresh();
          }}
          className="btn btn--secondary"
        >
          Toggle Edit Mode
        </button>
      </div>

      <div className="context-section">
        <h4>Form Context</h4>
        <p>
          Form Key: <strong>{formData?.formKey || 'N/A'}</strong>
        </p>
        <button
          onClick={() => {
            const current = formContext.get();
            formContext.set({
              ...current,
              formKey: `form-${Date.now()}`,
            });
            forceRefresh();
          }}
          className="btn btn--secondary"
        >
          Update Form Key
        </button>
      </div>

      <div className="context-section">
        <h4>Configurator Context</h4>
        <p>
          Theme: <strong>{configuratorData?.theme || 'N/A'}</strong>
        </p>
        <p>
          Layout: <strong>{configuratorData?.layout || 'N/A'}</strong>
        </p>
        <p>
          Items Per Page: <strong>{configuratorData?.itemsPerPage || 'N/A'}</strong>
        </p>
        <p>
          Has Changed:{' '}
          <strong className={`status-${hasChanged}`}>{hasChanged ? 'YES' : 'NO'}</strong>
        </p>

        <div className="button-group">
          <button
            onClick={() => {
              const current = configuratorContext.configurator;
              if (current) {
                configuratorContext.setConfigurator({
                  ...current,
                  theme: current.theme === 'light' ? 'dark' : 'light',
                });
                forceRefresh();
              }
            }}
            className="btn btn--secondary"
          >
            Toggle Theme
          </button>
          <button
            onClick={() => {
              configuratorContext.saveToCache();
              forceRefresh();
            }}
            className="btn btn--primary"
          >
            Save to Cache
          </button>
        </div>
      </div>

      <div className="context-section">
        <h4>Debug Info</h4>
        <p>
          App Data: <code>{JSON.stringify(appData, null, 2)}</code>
        </p>
        <p>
          Form Data: <code>{JSON.stringify(formData, null, 2)}</code>
        </p>
        <p>
          Configurator Data: <code>{JSON.stringify(configuratorData, null, 2)}</code>
        </p>
      </div>
    </div>
  );
}

export function GlobalProviderDemo() {
  const [demoStarted, setDemoStarted] = useState(false);

  function startDemo() {
    setDemoStarted(true);
  }

  return (
    <div className="demo-container">
      {!demoStarted ? (
        <div className="start-demo">
          <h3>GlobalProvider Interactive Demo</h3>
          <p>Click below to start the demo and explore GlobalProvider features.</p>
          <button onClick={startDemo} className="btn btn--primary">
            Start Demo
          </button>
        </div>
      ) : (
        <GlobalProvider initialContexts={initialContexts} debug={false}>
          <DemoContent />
        </GlobalProvider>
      )}
    </div>
  );
}

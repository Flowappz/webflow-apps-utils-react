import './Example.css';

import { useState } from 'react';

import { InfoIcon, SaveIcon, WarningTriangleIcon } from '../../icons';
import { Button } from '../button';
import { Modal } from './Modal';

export const Example = () => {
  // Modal states
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [noHeaderModalOpen, setNoHeaderModalOpen] = useState(false);
  const [preventCloseModalOpen, setPreventCloseModalOpen] = useState(false);
  const [customStyledModalOpen, setCustomStyledModalOpen] = useState(false);
  const [longContentModalOpen, setLongContentModalOpen] = useState(false);
  const [customFooterModalOpen, setCustomFooterModalOpen] = useState(false);

  // Loading simulation
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading modal
  function handleShowLoading() {
    setLoadingModalOpen(true);
    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  // Handle prevent close modal
  function handleForceClose() {
    setPreventCloseModalOpen(false);
  }

  return (
    <div className="modal-examples">
      <h2>Modal Component Examples</h2>
      <p>Interactive examples demonstrating different modal configurations and behaviors.</p>

      <div className="example-section">
        <h3>Basic Examples</h3>
        <div className="button-grid">
          <Button variant="primary" onclick={() => setBasicModalOpen(true)}>
            Basic Modal
          </Button>
          <Button variant="primary" onclick={handleShowLoading}>
            Loading Modal
          </Button>
          <Button variant="primary" onclick={() => setNoHeaderModalOpen(true)}>
            No Header/Footer Modal
          </Button>
          <Button variant="primary" onclick={() => setPreventCloseModalOpen(true)}>
            Prevent Close Modal
          </Button>
          <Button variant="primary" onclick={() => setCustomStyledModalOpen(true)}>
            Custom Styled Modal
          </Button>
          <Button variant="primary" onclick={() => setLongContentModalOpen(true)}>
            Long Content Modal
          </Button>
          <Button variant="primary" onclick={() => setCustomFooterModalOpen(true)}>
            Custom Footer Modal
          </Button>
        </div>
      </div>

      <Modal
        open={basicModalOpen}
        width="400px"
        height="300px"
        padding="8px 12px"
        title="Basic Modal"
        actionText="Confirm"
        cancelText="Cancel"
        onOpenChange={(open) => setBasicModalOpen(open)}
        onAction={() => {
          console.log('Action clicked');
          setBasicModalOpen(false);
        }}
        onCancel={() => {
          console.log('Cancel clicked');
          setBasicModalOpen(false);
        }}
      >
        <div>
          <p>
            This is a basic modal with default header and footer. The header shows the title and
            close button, while the footer shows action and cancel buttons.
          </p>
          <p>The footer is properly positioned at the bottom using flexbox layout.</p>
          <p>
            Even with multiple paragraphs of content, the footer stays at the bottom of the modal.
          </p>
          <p>This ensures a consistent and predictable layout regardless of content length.</p>
        </div>
      </Modal>

      <Modal
        open={loadingModalOpen}
        width="400px"
        height="300px"
        headerPadding="12px 16px"
        contentPadding="16px"
        loading={isLoading}
        loadingMessage="Processing your request..."
        onOpenChange={(open) => setLoadingModalOpen(open)}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SaveIcon />
            <h3>Processing</h3>
          </div>
        }
      >
        <p>
          This modal demonstrates the loading state. The loading overlay will disappear after 3
          seconds.
        </p>
      </Modal>

      <Modal
        open={noHeaderModalOpen}
        width="400px"
        height="300px"
        contentPadding="32px"
        showHeader={false}
        showFooter={false}
        onOpenChange={(open) => setNoHeaderModalOpen(open)}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <InfoIcon />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Welcome!</h3>
          <p>This modal has no header or footer. Close it by clicking outside or pressing Escape.</p>
        </div>
      </Modal>

      <Modal
        open={preventCloseModalOpen}
        width="400px"
        height="300px"
        headerPadding="12px"
        contentPadding="12px"
        footerPadding="12px"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        title="⚠️ Important Notice"
        actionText="I Understand"
        cancelText="Dismiss"
        onOpenChange={(open) => setPreventCloseModalOpen(open)}
        onAction={handleForceClose}
        onCancel={() => setPreventCloseModalOpen(false)}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WarningTriangleIcon />
            <h3>⚠️ Important Notice</h3>
          </div>
        }
      >
        <p>
          This modal cannot be closed by clicking outside or pressing Escape. You must use the
          footer buttons below to close it.
        </p>
      </Modal>

      <Modal
        open={customStyledModalOpen}
        width="400px"
        height="300px"
        headerPadding="24px"
        contentPadding="24px"
        overlayColor="rgba(255, 0, 100, 0.3)"
        style={{ border: '3px solid #ff6b6b', boxShadow: '0 0 30px rgba(255, 107, 107, 0.5)' }}
        onOpenChange={(open) => setCustomStyledModalOpen(open)}
        header={<h3 style={{ color: '#ff6b6b' }}>🎨 Custom Styled Modal</h3>}
      >
        <div>
          <p>This modal demonstrates custom styling with:</p>
          <ul style={{ margin: '16px 0', paddingLeft: '20px' }}>
            <li>Individual section padding</li>
            <li>Pink overlay background</li>
            <li>Custom border and shadow</li>
            <li>Colorful header text</li>
          </ul>
        </div>
      </Modal>

      <Modal
        open={longContentModalOpen}
        width="400px"
        height="300px"
        title="Layout Demo"
        actionText="Confirm"
        cancelText="Cancel"
        onOpenChange={(open) => setLongContentModalOpen(open)}
        onAction={() => setLongContentModalOpen(false)}
        onCancel={() => setLongContentModalOpen(false)}
      >
        <div>
          <h4>Flexbox Layout Demonstration</h4>
          <p>This modal demonstrates how the flexbox layout keeps the footer at the bottom.</p>
          <p>
            Even when the content is long and exceeds the modal height, the footer remains
            positioned correctly at the bottom.
          </p>
          <p>The content area becomes scrollable while the header and footer stay in place.</p>
          <p>This provides a consistent user experience regardless of content length.</p>
          <p>Here&apos;s some additional content to show the scrolling behavior:</p>
          <ul>
            <li>Item 1: Flexbox provides excellent layout control</li>
            <li>Item 2: The footer stays anchored at the bottom</li>
            <li>Item 3: Content area scrolls independently</li>
            <li>Item 4: Header remains fixed at the top</li>
            <li>Item 5: This creates a professional modal layout</li>
          </ul>
          <p>
            You can scroll through this content while the footer remains visible and accessible.
          </p>
          <p>
            This is especially important for forms or detailed content that needs action buttons.
          </p>
        </div>
      </Modal>

      <Modal
        open={customFooterModalOpen}
        width="400px"
        height="300px"
        title="Custom Footer Example"
        actionText="Save Changes"
        cancelText="Cancel"
        onOpenChange={(open) => setCustomFooterModalOpen(open)}
        onAction={() => {
          console.log('Save action triggered');
          setCustomFooterModalOpen(false);
        }}
        onCancel={() => {
          console.log('Cancel action triggered');
          setCustomFooterModalOpen(false);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div
              style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'space-between' }}
            >
              <Button
                variant="secondary"
                onclick={() => {
                  console.log('Custom cancel clicked');
                  setCustomFooterModalOpen(false);
                }}
              >
                ✕ Cancel
              </Button>
              <Button
                variant="primary"
                onclick={() => {
                  console.log('Custom save clicked');
                  setCustomFooterModalOpen(false);
                }}
              >
                ✓ Save &amp; Close
              </Button>
            </div>
          </div>
        }
      >
        <div>
          <p>
            This modal demonstrates custom footer styling while maintaining proper functionality.
          </p>
          <p>
            Both the &quot;Save Changes&quot; and &quot;Cancel&quot; buttons will close the modal
            and trigger their respective callbacks.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Example;

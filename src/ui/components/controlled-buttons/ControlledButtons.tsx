import './ControlledButtons.css';

import { ChevronIcon } from '../../icons';
import { Button } from '../button';
import { Section } from '../section';
import { Text } from '../text';
import { Tooltip } from '../tooltip';
import type { ControlledButtonsProps } from './types';

export const ControlledButtons = ({ buttons, className = '' }: ControlledButtonsProps) => {
  return (
    <div className={`footer ${className}`}>
      <div className="controlled-buttons">
        {buttons.map((button, index) => {
          if (button.show === false) return null;

          const key = button.id || index;

          if (button?.popupButtons?.length) {
            return (
              <Tooltip
                key={key}
                position="fixed"
                placement="top-start"
                offsetVal={8}
                padding="0"
                showArrow={false}
                listener={button.popupTrigger || 'click'}
                listenerout={button.popupTrigger || 'click'}
                width="210px"
                stopPropagation={false}
                target={
                  <Button
                    text={button.text}
                    variant={button.variant || 'primary'}
                    disabled={button.disabled || false}
                    loading={button.loading || false}
                    rightIcon={ChevronIcon}
                    className="popup-button-chevron"
                  />
                }
                tooltip={
                  <div role="button" tabIndex={0} className="popup-content">
                    <div className="popup-content-list">
                      {(button.popupButtons || []).map((popupButton, popupIndex) => {
                        if (popupButton.show === false) return null;

                        const PopupButtonIcon = popupButton.icon;

                        return (
                          <Section
                            key={popupIndex}
                            className="link"
                            padding="4px var(--Spacing-8, 8px)"
                            clickable
                            disabled={popupButton.disabled || popupButton.loading}
                            onclick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (popupButton.disabled || popupButton.loading) return;
                              if (typeof popupButton.onClick === 'function') popupButton.onClick();
                            }}
                          >
                            {PopupButtonIcon ? (
                              <span className="popup-content-icon">
                                <PopupButtonIcon />
                              </span>
                            ) : null}
                            <div className="popup-content-item">
                              <Text
                                label={popupButton.text}
                                fontWeight="500"
                                fontColor="var(--text1)"
                                fontSize="normal"
                              />
                              <Text
                                label={popupButton.description || ''}
                                raw={true}
                                fontColor="var(--text2)"
                                fontSize="normal"
                              />
                            </div>
                          </Section>
                        );
                      })}
                    </div>
                  </div>
                }
              />
            );
          }

          if (button.tooltip) {
            const TooltipIcon = button.tooltip?.icon;

            return (
              <Tooltip
                key={key}
                padding="0"
                width={button.tooltip?.width || '160px'}
                placement={button.tooltip?.placement || 'top'}
                offsetVal={10}
                showArrow={button.tooltip?.showArrow !== false}
                stopPropagation={false}
                target={
                  <Button
                    text={button.text}
                    variant={button.variant || 'primary'}
                    disabled={button.disabled || false}
                    loading={button.loading || false}
                    onclick={button.onClick || (() => {})}
                  />
                }
                tooltip={
                  <div
                    className={`tooltip-content ${button.tooltip?.className || ''}`}
                    style={{ display: button.tooltip?.icon ? 'grid' : 'inline-block' }}
                  >
                    {TooltipIcon ? (
                      <span className="icon">
                        <TooltipIcon />
                      </span>
                    ) : null}
                    <Text label={button.tooltip?.content || ''} fontColor="var(--text2)" />
                  </div>
                }
              />
            );
          }

          return (
            <Button
              key={key}
              text={button.text}
              variant={button.variant || 'primary'}
              disabled={button.disabled || button.loading || false}
              loading={button.loading || false}
              onclick={button.onClick || (() => {})}
            />
          );
        })}
      </div>
    </div>
  );
};

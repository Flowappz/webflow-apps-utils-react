import { BodyIcon, DivBlock, SelectIcon } from '../../icons';

import './SelectBodyOrDivBlock.css';

export const SelectBodyOrDivBlock = () => (
  <div className="select-msg-wrap">
    <div className="info">
      <SelectIcon />
    </div>
    <span>Select </span>
    <BodyIcon />
    <span>Body or</span>
    <DivBlock />
    <span>Div Block</span>
  </div>
);

export default SelectBodyOrDivBlock;

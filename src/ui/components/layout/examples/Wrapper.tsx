import { GlobalProvider } from '../../../providers';

import ExampleLayout from './ExampleLayout';

export const Wrapper = () => (
  <GlobalProvider>
    <ExampleLayout />
  </GlobalProvider>
);

export default Wrapper;

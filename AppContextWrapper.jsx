import {TokenManager} from './src/common/TokenManager';
import App from './App';

const AppContextWrapper = () => {
  return (
    <TokenManager>
      <App />
    </TokenManager>
  );
};

export default AppContextWrapper;

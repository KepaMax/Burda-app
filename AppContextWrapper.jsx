import SuperAlert from "react-native-super-alert";
import App from './App';

const AppContextWrapper = () => {
    return (
        <>
            <App />
            <SuperAlert />
        </>
    );
};

export default AppContextWrapper;
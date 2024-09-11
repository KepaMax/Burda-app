import SuperAlert from 'react-native-super-alert';
import App from './App';

const customStyle = {
  container: {
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
  },
  buttonCancel: {
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#7658F2',
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  buttonConfirm: {
    backgroundColor: '#7658F2',
    borderRadius: 6,
    paddingHorizontal: 20,
  },
  textButtonCancel: {
    color: '#7658F2',
    fontWeight: 'bold',
  },
  textButtonConfirm: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    color: '#000',
    fontSize: 16,
  },
  message: {
    color: '#4f4f4f',
    fontSize: 12,
  },
};

const AppContextWrapper = () => {
  return (
    <>
      <App />
      <SuperAlert customStyle={customStyle} />
    </>
  );
};

export default AppContextWrapper;

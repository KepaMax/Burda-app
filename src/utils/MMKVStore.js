import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

storage.set('selectedLanguage', 'az');

storage.set('buttonType', '#FF8C03');


export default storage;

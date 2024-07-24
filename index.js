/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppContextWrapper from './AppContextWrapper';

AppRegistry.registerComponent(appName, () => AppContextWrapper);

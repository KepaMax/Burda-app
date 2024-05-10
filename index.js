/**
 * @format
 */

import { AppRegistry } from "react-native";
import AppContextWrapper from "./AppContextWrapper";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => AppContextWrapper);

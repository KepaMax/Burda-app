
import { refreshTokens } from "./authUtils";
import { storage } from "./MMKVStore";

export const fetchData = async (url, headers, method = "GET", body = null, getData = true) => {
    try {
        const response = body !== null ?
            await fetch(url, {
                headers: headers,
                method: method,
                body: body
            }) :
            await fetch(url, {
                headers: headers,
                method: method
            })
        const status = response.status;
        const data = getData ? await response.json() : null;

        if (response.ok) {
            console.log("Response is OK")
            return { success: true, status: status, data: data }
        }
        else if (response.status === 401) {
            const success = await refreshTokens();
            if (success) {
                console.log("IT WORKS")
                return await fetchData(url, headers, method, body, getData)
            }
            else {
                alert("Warning", "Session expired");
                storage.set("loggedIn", false);
            }
        }
        else {
            return { success: false, data: data, status: status }
        }
    } catch (error) {
        console.log(error)
        return { success: false, status: 0, data: null }
    }
}
import tls from "tls";
import validator from "validator";

export const checkTLS = (url) => {
    try {
        const port = checkPortInURL(url) || "443"; 
        if (!port || port === "80") return false;

        let authorized = false;

        // Połączenie TLS bez użycia HTTPS bezpośrednio
        const socket = tls.connect({ host: url, port }, () => {
            const cert = socket.getPeerCertificate();
            socket.end();

            if (cert && cert.valid_to) {
                authorized = socket.authorized;
            }
        });

        socket.on("error", () => {
            authorized = false;
        });

        return authorized; 
    } catch (error) {
        return false;
    }
};

export const checkPortInURL = (url) => {
    if (validator.isURL(url) || validator.isIP(url)) {
        const hasPort = url.match(/:\d+$/);
        return hasPort ? hasPort[0].replace(":", "") : null;
    }
    return null;
};

export const generateMassURL = (url) => {
    const port = checkPortInURL(url);
    return port !== null ? port : isHttps(url) ? "443" : "80";
};

export const isHttps = (url) => {
    return checkTLS(url); // Sprawdzanie poprzez funkcję TLS
};

export const isHttp = (url) => {
    return !checkTLS(url);
};

const table = {
    checkTLS,
    generateMassURL,
    checkPortInURL,
    isHttps,
    isHttp
};

export default table;
import tls from "tls";
import validator from "validator";
import https from "https";

export const checkTLS = (url) => {
    try {
        const port = checkPortInURL(url) || "443";
        if (!port || port === "80") return false;

        let authorized = false;

        // Nawiązanie połączenia TLS
        const socket = tls.connect({ host: url, port }, () => {
            const cert = socket.getPeerCertificate();
            socket.end();

            if (cert && cert.valid_to) {
                authorized = socket.authorized;
            }
        });

        // Obsługa błędów
        socket.on("error", () => {
            authorized = false;
        });

        return authorized; // Zwraca wartość certyfikatu
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
    try {
        const request = https.get(`https://${domain}`);
        request.abort(); // Zatrzymanie zapytania, nie pobieramy danych
        return true;
      } catch (error) {
        return false;
      }
    
};

export const isHttp = (url) => {
    return !isHttps(url);
};

const table = {
    checkTLS,
    generateMassURL,
    checkPortInURL,
    isHttps,
    isHttp
};

export default table;
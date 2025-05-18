import tls from "tls";
import validator from "validator";
import https from "https";

// Sprawdza certyfikat TLS strony
export const checkTLS = (url) => {
    if (!isHttps(url)) return false;
    try {
        const port = generateMassURL(url);
        if (!port) return false; // Upewnij się, że port jest poprawny

        // Nawiązanie połączenia TLS
        const socket = tls.connect({ host: url, port }, () => {
            const cert = socket.getPeerCertificate();
            socket.end();

            if (!cert || !cert.valid_to) {
                return false;
            }
        });

        // Obsługa błędów
        socket.on("error", () => {
            return false;
        });

        return socket.authorized; // Zwraca prawidłową wartość certyfikatu
    } catch (error) {
        return false;
    }
};

// Sprawdza, czy URL zawiera port
export const checkPortInURL = (url) => {
    if (validator.isURL(url) || validator.isIP(url)) {
        const hasPort = url.match(/:\d+$/);
        return hasPort ? hasPort[0].replace(":", "") : null;
    }
    return null;
};

// Sprawdza, jaki port powinna mieć strona
export const generateMassURL = (url) => {
    const port = checkPortInURL(url);
    return port !== null ? port : isHttps(url) ? "443" : "80";
};

// Sprawdza, czy strona działa na HTTPS
export const isHttps = (url) => {
    try {
        https.get(url);
        return true;
    } catch {
        return false;
    }
};

// Sprawdza, czy strona działa na HTTP
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
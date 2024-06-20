function injectStart() {
    Traces[0]();
}

function injectStop() {
    Traces[1]();
}

function injectCode(src) {
    const script = document.createElement('script');
    script.src = src;
    document.documentElement.appendChild(script);
}
injectCode(chrome.runtime.getURL("traces.js"))

function injectCodes() {
injectCode(chrome.runtime.getURL("traces.js"))
}

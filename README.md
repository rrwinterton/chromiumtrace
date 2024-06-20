# chromiumtrace

# prefix nop
"C:\Program Files\Google\Chrome\Application\chrome.exe" --no-sandbox --js-flags="--experimental-wasm-instruction-tracing" 

# Add this to command line if using CPUID
add this for cpuid --wasm-trace-native=cpuid"

# ssc control using sde
sde -mix -control start:ssc:99 -control stop:ssc:7755 -early-out -attach-pid 1384

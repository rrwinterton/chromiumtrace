function getTraceFunctions(markers) {
    let nFunctions = markers.length;
    let encodeLEB128 = (v) => {
        let bytes = []
        do {
            let byte = v & 0x7f;
            v >>= 7;
            if (v != 0)
                byte |= 0x80;
            bytes.push(byte);
        } while (v != 0);
        return bytes;
    }
    let getChars = (v) => {
        let chars = [];
        for (let i = 0; i < v.length; i++)
            chars.push(v.charCodeAt(i));
        return chars;
    }
    let getBytes = (v) => {
        let bytes = [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
        let i = 0;
        for (; i < 4; i++) {
            if (bytes[i] !== 0) break;
        }
        bytes.splice(0, i);
        return bytes.length === 0 ? [0x00] : bytes;
    }

    let header = [0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00]
    let type_section = [0x01, 0x04, 0x01, 0x60, 0x00, 0x00];

    let function_section = [0x03, ...encodeLEB128(nFunctions + 1), ...encodeLEB128(nFunctions)];
    for (let i = 0; i < nFunctions; i++) function_section.push(0x00);

    let export_section = [0x07];
    let e = [...encodeLEB128(nFunctions)];
    for (let func_idx = 0; func_idx < nFunctions; func_idx++) {
        let name = getChars(`f${func_idx}`);
        e.push(...encodeLEB128(name.length));
        e.push(...name);
        e.push(0x00);
        e.push(...encodeLEB128(func_idx));
    }
    export_section.push(...encodeLEB128(e.length));
    export_section.push(...e);

    let metadata = [0x00];
    let metadata_name = getChars("metadata.code.trace_inst");
    let metadata_name_length = encodeLEB128(metadata_name.length);
    let marks = [...encodeLEB128(nFunctions)];
    for (let func_idx = 0; func_idx < nFunctions; func_idx++) {
        marks.push(...encodeLEB128(func_idx));
        marks.push(0x01);
        marks.push(0x01);
        let mark = getBytes(markers[func_idx])
        marks.push(mark.length);
        marks.push(...mark);
    }
    let metadata_length = metadata_name.length + metadata_name_length.length + marks.length;
    metadata.push(...encodeLEB128(metadata_length));
    metadata.push(...metadata_name_length);
    metadata.push(...metadata_name);
    metadata.push(...marks);

    let code = [0x0A];
    let func_bodies = [...encodeLEB128(nFunctions)];
    for (let func_idx = 0; func_idx < nFunctions; func_idx++) {
        func_bodies.push(...[0x03, 0x00, 0x01, 0x0B]);
    }
    code.push(...encodeLEB128(func_bodies.length));
    code.push(...func_bodies);

    let bytes_list = [...header, ...type_section, ...function_section, ...export_section, ...metadata, ...code];
    let bytes = new Uint8Array(bytes_list);
    let mod = new WebAssembly.Module(bytes);
    let inst = new WebAssembly.Instance(mod);
    let exp = inst.exports;

    let functions = []
    for (let f in exp) {
        functions.push(exp[f])
    }
    return functions;
}
/*
window._all_traces = getTraceFunctions([0x1001, 0x1002, 0x1003, 0x1004]);
window.START_BENCHMARK = window._all_traces[0];
window.STOP_BENCHMARK = window._all_traces[1]
window.START_ROI = window._all_traces[2]
window.STOP_ROI = window._all_traces[3]
window.test1 = () => {console.log("hello world")}
*/
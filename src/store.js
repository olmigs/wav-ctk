import { derived, get, writable } from 'svelte/store';
import { path } from '@tauri-apps/api';

// localStorage.removeItem('wavc_filename');
// localStorage.removeItem('wavc_inputFilepath');
// localStorage.removeItem('wavc_outputFilepath');

const storedFilename = localStorage.getItem('wavc_filename');
export const filename = writable(storedFilename ? storedFilename : 'out.dw7');
filename.subscribe((value) => {
    localStorage.setItem('wavc_filename', value ? value : 'out.dw7');
});

const defaultInputFilepath = import.meta.env.PROD
    ? 'No folder chosen...'
    : '/Users/migs/dev/python/git/CTK4400/db';
const storedInputFilepath = localStorage.getItem('wavc_inputFilepath');
export const inputFilepath = writable(
    storedInputFilepath ? storedInputFilepath : defaultInputFilepath
);
inputFilepath.subscribe((value) => {
    localStorage.setItem(
        'wavc_inputFilepath',
        value ? value : defaultInputFilepath
    );
});

export async function getInputFilepath() {
    let currVal = get(inputFilepath);
    if (currVal === 'No folder chosen...') {
        currVal = await path.downloadDir();
        inputFilepath.set(currVal);
    }
    return currVal;
}

const defaultOutputFilepath = import.meta.env.PROD
    ? 'No folder chosen...'
    : await path.resourceDir();
const storedOutputFilepath = localStorage.getItem('wavc_outputFilepath');
export const outputFilepath = writable(
    storedOutputFilepath ? storedOutputFilepath : defaultOutputFilepath
);
outputFilepath.subscribe((value) => {
    localStorage.setItem(
        'wavc_outputFilepath',
        value ? value : defaultOutputFilepath
    );
});

export async function getOutputFilepath() {
    let currVal = get(outputFilepath);
    if (currVal === 'No folder chosen...') {
        currVal = await path.downloadDir();
        outputFilepath.set(currVal);
    }
    return currVal;
}

export function set_outputFilepath(val) {
    outputFilepath.set(val);
}

export const selected = writable(getEmptySlots());
export const available = derived(selected, ($sel) => deriveAvailable($sel));

function deriveAvailable(sel, includeBlank = true) {
    let avail = sel.filter((el) => el !== null);
    if (includeBlank) avail.unshift('');
    return avail;
}

function getEmptySlots() {
    return [null, null, null, null, null, null, null, null];
}

const EMPTY_SLOT_COLOR = '#fff3cc';
function getEmptyColors() {
    return [
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
        EMPTY_SLOT_COLOR,
    ];
}

const IMPORTED_CHIP_COLOR = '#ffda66';
export const selected_colors = writable(
    deriveColors(get(selected), IMPORTED_CHIP_COLOR)
);
export const selected_colors_clearing = derived(selected, ($sel) =>
    deriveColors($sel, '#f42324')
);

function deriveColors(sel, color) {
    let cols = getEmptyColors();
    for (let i = 0; i < sel.length; i++) {
        if (sel[i] !== null) {
            cols[i] = color;
        }
    }
    return cols;
}

export function update_selected_color(idx, col) {
    let currColors = get(selected_colors);
    if (col === 'reset') {
        currColors[idx] = IMPORTED_CHIP_COLOR;
    } else {
        currColors[idx] = col;
    }

    selected_colors.set(currColors);
}

export function add_selected(paths) {
    let currSelected = get(selected);
    for (let p of paths) {
        if (!currSelected.includes(p)) {
            currSelected.push(p);
        }
    }
    selected.set(currSelected);
}

export function add_selected_index(i, path) {
    if (!path) return;
    let currSelected = get(selected);
    currSelected[i] = path;
    selected.set(currSelected);
    // ensure color updates
    update_selected_color(i, 'reset');
}

export function clear_selected(i) {
    let currSelected = get(selected);
    currSelected[i] = null;
    selected.set(currSelected);
    // ensure color updates
    update_selected_color(i, EMPTY_SLOT_COLOR);
}

export function get_selected(i) {
    let currSelected = get(selected);
    return currSelected[i];
}

export const emu = writable(getEmptySlots());

export function add_emu() {}

export const json = writable({});

export function add_json(key, obj) {
    let curr_json = get(json);
    curr_json[key] = obj;
    json.set(curr_json);
}

export function get_json(key) {
    let curr_json = get(json);
    return curr_json[key] ? curr_json[key] : null;
}

export const edits = writable({});

export function add_edit(sampleKey, sampleValue) {
    let curr_edits = get(edits);
    curr_edits[sampleKey] = sampleValue;
    edits.set(curr_edits);
}

export function get_edit(sampleKey) {
    let curr_edits = get(edits);
    let sampleValue = curr_edits[sampleKey];
    if (sampleValue) {
        return sampleValue;
    } else {
        return {
            momentary: 0,
            mute_group: 0,
            pitch_shift: 0,
            vol: 0.0,
            pan: 0,
        };
    }
}

export function clear() {
    edits.set({});
    selected.set(getEmptySlots());
}

function prettyPrint(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

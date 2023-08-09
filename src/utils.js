import { dialog, invoke, path } from '@tauri-apps/api';
import { trace, info, error, attachConsole } from 'tauri-plugin-log-api';
import {
    add_selected_index,
    getInputFilepath,
    getOutputFilepath,
    set_outputFilepath,
} from './store';
import prettyBytes from 'pretty-bytes';

export async function startLogging() {
    return await attachConsole();
}

const defaultInDir = await getInputFilepath();
const defaultOutDir = await getOutputFilepath();

/** @migstodo use Tauri API to get Downloads dir */
export function openDialogForSlot(_event, slot, dir = defaultInDir) {
    return dialog
        .open({
            defaultPath: dir,
            filters: [
                {
                    name: 'Waveform Audio',
                    extensions: ['wav'],
                },
            ],
            multiple: false,
            directory: false,
        })
        .then((input) => {
            if (input) {
                add_selected_index(slot, input);
                invoke('file_stat', { filename: input })
                    .then((statStr) => {
                        let stat = JSON.parse(statStr);
                        console.log(prettyBytes(stat.size));
                    })
                    .catch((err) => console.error(err));
            }
        })
        .catch((err) => console.error(err));
}

export function openDialogForOutput(_event, dir = defaultOutDir) {
    return dialog
        .open({
            defaultPath: dir,
            // filters: [
            //     {
            //         name: 'Waveform Audio',
            //         extensions: ['wav'],
            //     },
            // ],
            multiple: false,
            directory: true,
        })
        .then((outputPath) => {
            if (outputPath) {
                set_outputFilepath(outputPath);
            }
        })
        .catch((err) => console.error(err));
}

export function writeJson(json) {
    console.log(json);
}

export function convertBytes(bytes) {}

export function outputJson(json, name) {
    path.resourceDir().then((dir) => {
        invoke('write_json', { json: JSON.stringify(json), path: dir })
            .then((out_write_json) => {
                console.log(out_write_json);
                invoke('exec_wtd', { path: dir, name, out: defaultOutDir })
                    .then((out_exec_ctk) => {
                        console.log(out_exec_ctk);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert(err);
                    });
            })
            .catch((err) => console.error(err));
    });
}

export function execDTW(input, output) {
    invoke('exec_dtw', { input_file: input, output_path: output })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
}

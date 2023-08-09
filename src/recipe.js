import {
    BaseDirectory,
    exists,
    readDir,
    readTextFile,
    writeTextFile,
} from '@tauri-apps/api/fs';

export class FileMonitor {
    constructor(d, e) {
        this.started = false;
        this.dir = d;
        this.ext = e;
    }

    async start() {
        try {
            this.started = await exists(this.dir, {
                dir: BaseDirectory.Home,
            });
        } catch (err) {
            // migstodo: open select folder dialog?
            if (err.includes('path not allowed on the configured scope')) {
                console.warn(
                    `this path needs to be allow-listed:${err.split(':')[1]}`
                ); // migslog
            }
        }
    }

    async readDir() {
        if (this.started) {
            const files = await readDir(this.dir, {
                dir: BaseDirectory.Home,
                recursive: false,
            });
            return files.filter((el) => el.name.includes(this.ext));
        } else return []; // migstodo: start me!
    }

    async readFile(name) {
        if (this.started) {
            const content = await readTextFile(`${this.dir}/${name}`, {
                dir: BaseDirectory.Home,
            });
            return content;
        } else return null;
    }

    writeFileCopy(file, contents) {
        if (this.started && file) {
            writeTextFile(`${this.dir}/${file.name}`, contents, {
                dir: BaseDirectory.Home,
            });
        } else {
            // migstodo: open create file dialog
        }
    }
}

// migstodo: remove
class TabbedMonitor {
    dirs = [];

    add(tab, dir, ext) {
        this.dirs.push({ mon: new FileMonitor(dir, ext), tab });
    }
    async startAll() {
        for (let dir of this.dirs) {
            await dir.mon.start();
        }
    }
    getTabMon(tab) {
        return this.dirs.find((d) => d.tab === tab).mon;
    }
}

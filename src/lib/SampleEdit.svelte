<script>
    import { basename } from '@tauri-apps/api/path';
    import Pan from '../ext/Pan.svelte';
    import Volume from '../ext/Volume.svelte';
    import { onMount, afterUpdate } from 'svelte';
    import {
        add_edit,
        get_edit,
        get_json,
        available,
        selected,
        add_json,
    } from '../store';
    export let key = ''; // string

    let init,
        momentary = false;
    let mgroup = 0;
    let pan, pshift, vol;
    let filePath = '';

    let dialog; // HTMLDialogElement

    function addToJsonIfSelected() {
        if (filePath !== '') {
            add_json(key, {
                file: filePath,
                momentary: momentary ? 1 : 0,
                mute_group: mgroup,
                vol,
                pan,
                pitch_shift: pshift,
            });
        }
    }

    $: {
        if (dialog && key !== '') {
            init = false;
            dialog.showModal();
        }
    }

    async function setup() {
        if (!init) {
            let sampleObj = await get_json(key);
            if (sampleObj) {
                filePath = sampleObj.file;
                momentary = sampleObj.momentary === 1;
                mgroup = sampleObj.mute_group;
                pan = sampleObj.pan;
                vol = sampleObj.vol;
                pshift = sampleObj.pitch_shift;
            } else {
                momentary = false;
                mgroup = 0;
                pshift = 0;
                vol = 0.0;
                pan = 0;
            }
            init = true;
        }
    }

    function close() {
        addToJsonIfSelected();
        init = false;
        dialog.close();
    }

    afterUpdate(async () => {
        await setup();
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={() => {
        // cleanup
        key = '';
        filePath = '';
    }}
    on:click|self={close}
>
    <div on:click|stopPropagation>
        <select bind:value={filePath}>
            {#each $available as a}
                <option value={a}>
                    {a}
                </option>
            {/each}
        </select>
        <hr />
        <strong>Momentary</strong>
        <input bind:checked={momentary} id="mode" type="checkbox" />
        <br />
        <div class="mgroups">
            <strong>Mute Group</strong>
            <label>
                <input
                    type="radio"
                    bind:group={mgroup}
                    name="mute_group"
                    value={0}
                />
                None
            </label>
            <label>
                <input
                    type="radio"
                    bind:group={mgroup}
                    name="mute_group"
                    value={1}
                />
                1
            </label>
            <label>
                <input
                    type="radio"
                    bind:group={mgroup}
                    name="mute_group"
                    value={2}
                />
                2
            </label>
            <label>
                <input
                    type="radio"
                    bind:group={mgroup}
                    name="mute_group"
                    value={3}
                />
                3
            </label>
        </div>
        <Pan
            name="test_pshift"
            id="test_pshift"
            bind:pan={pshift}
            label="Pitch Shift"
            color="green"
            min={-64}
            max={63}
        />
        <Pan
            name="test_pan"
            id="test_pan"
            bind:pan
            label="Panning"
            color="blue"
            min={-64}
            max={63}
        />
        <Volume
            name="test_vol"
            id="test_vol"
            bind:vol
            label="Volume"
            color="turquoise"
            min={-92.0}
            max={4.2}
        />
        <div class="simple_flex">
            <!-- svelte-ignore a11y-autofocus -->
            <button autofocus on:click={close}>Close</button>
        </div>
    </div>
</dialog>

<style>
    dialog {
        max-width: 32em;
        border-radius: 0.2em;
        border: none;
        padding: 0;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }
    .mgroups {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .simple_flex {
        display: flex;
        flex-direction: row;
        justify-content: right;
    }
</style>

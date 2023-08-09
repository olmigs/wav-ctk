<script>
    import SafeInput from './ext/SafeInput.svelte';
    import PadSpace from './lib/PadSpace.svelte';
    import Keyboard from './lib/Keyboard.svelte';
    import Button from './ext/Button.svelte';
    import SampleEdit from './lib/SampleEdit.svelte';
    import { clear, json, filename, outputFilepath } from './store';
    import {
        openDialogForOutput,
        outputJson,
        startLogging,
        writeJson,
    } from './utils';
    import { onDestroy, onMount } from 'svelte';

    // let dw7_name = 'out.dw7';
    let assigning = true;

    let detach = () => {};

    onMount(async () => {
        detach = await startLogging();
    });

    onDestroy(detach);

    function noteOn(event) {
        // console.log(`we\'re ${assigning ? '' : 'not '}assigning, fyi....`);
    }

    function noteOff(event) {
        if (assigning) {
            displayModal(event.detail);
        }
        // migstodo: probably set color (corresponding to sample)
    }

    function getAssign() {
        assigning = !assigning;
        return assigning;
    }

    let keys = {};
    for (let i = parseInt('24', 16); i <= parseInt('60', 16); i++) {
        keys[i] = i.toString(16);
    }

    // sample edit
    let samplePath = '';

    function displayModal(key) {
        samplePath = key;
    }
</script>

<svelte:head>
    <title>Wave CTK</title>
</svelte:head>

<div>
    <div class="ctrl">
        <span>
            <Button
                val="Clear or Replace Pads"
                val_color="#f42324"
                alt_val_color="#f4b183"
                toggleHook={getAssign}
                condition={!assigning}
            />
            <input
                class="disabled"
                readonly
                type="text"
                title={$outputFilepath}
                bind:value={$outputFilepath}
                on:click|preventDefault={openDialogForOutput}
            />
            <SafeInput
                class="dw7_input"
                name="dw7_input"
                bind:input={$filename}
                index={1}
            />
            <Button
                val="Output DW7"
                val_color="#24f2c1"
                toggleHook={() => outputJson($json, $filename)}
            />
        </span>
    </div>

    <div class="test">
        <PadSpace canEdit={!assigning} />
    </div>
    <SampleEdit bind:key={samplePath} />
    <Keyboard
        reps={keys}
        octaves={11}
        on:noteon={noteOn}
        on:noteoff={noteOff}
    />
    <!-- <input
        on:click={() => writeJson($json)}
        id="json"
        type="button"
        value="Print JSON"
    /> -->
    <!-- <input
        on:click={() => outputJson($json, dw7_name)}
        id="exec-ctk"
        type="button"
        value="Output DW7"
    /> -->
</div>

<style>
    .disabled {
        color: grey;
        background-color: #cacaca;
        width: 250px;
        text-overflow: ellipsis;
    }
    .disabled:hover {
        cursor: pointer;
    }
    .ctrl {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        max-width: 60vw;
    }
    .ctrl > span {
        align-self: center;
    }
    .test {
        display: grid;
        grid-template-areas:
            'a b e f'
            'c d g h';
        column-gap: 10%;
        width: 80%;
        height: 500px;
        margin-left: auto;
        margin-right: auto;
    }
</style>

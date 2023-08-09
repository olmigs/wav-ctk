<script>
    import ColorFile from './ColorFile.svelte';
    import SampleEdit from './SampleEdit.svelte';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let picks;
    export let max = 8;
    export let canPick = true;
    let selected = [];
    let colors = {};

    // sample edit
    let samplePath = '';

    function displayModal(file) {
        samplePath = file;
    }

    $: if (canPick) resetColors();

    function addToSelected(item) {
        if (canPick) {
            if (selected.includes(item)) {
                let index = selected.indexOf(item);
                selected.splice(index, 1);
                colors[item] = 'red';
            } else if (selected.length === max) {
                console.warn('deselect another to add to selected');
            } else {
                selected.push(item);
                colors[item] = 'yellow';
            }
        } else {
            // emit an event, send filename
            // change color to yellow
            //// should always reset to 'yellow' as files not in selected are not able to be assigned to
            if (selected.includes(item)) {
                resetColors();
                colors[item] = 'green';
                dispatch('assign', item);
            }
        }
    }

    function resetColors(color = 'green') {
        for (const [k, v] of Object.entries(colors)) {
            if (v === color) {
                colors[k] = 'yellow';
            }
        }
    }
</script>

<div>
    {#each picks as file}
        <div class="file">
            <ColorFile
                color={colors[file] ? colors[file] : 'red'}
                filename={file}
                clickHandler={() => addToSelected(file)}
            />
            <button on:click={() => displayModal(file)}>Edit</button>
        </div>
    {/each}
    <SampleEdit bind:key={samplePath} />
</div>

<style>
    .file {
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
    }
</style>

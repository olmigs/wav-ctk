<script>
    import Button from '../ext/Button.svelte';
    import { basename } from '@tauri-apps/api/path';
    import { onMount, tick } from 'svelte';
    import {
        clear,
        clear_selected,
        selected,
        selected_colors,
        selected_colors_clearing,
        update_selected_color,
    } from '../store';
    import { openDialogForSlot } from '../utils';
    export let slots = 8;
    export let canEdit = false;

    async function updateSelected(event, index) {
        await openDialogForSlot(event, index);
        clearFis(index);
        await tick();
    }

    function clearSelected(index) {
        clear_selected(index);
        clearFis(index);
    }

    function getFalseSlots() {
        return [false, false, false, false, false, false, false, false];
    }

    let lofi = getFalseSlots(),
        lowerfi = getFalseSlots();

    function clearFis(idx) {
        lofi[idx] = false;
        lowerfi[idx] = false;
    }

    function setColor(idx, mode) {
        // console.log(`lofi: ${lofi} :: lowerfi: ${lowerfi}`);
        let color;
        switch (mode) {
            case 'lofi':
                lofi[idx] = !lofi[idx];
                lowerfi[idx] = false;
                if (lofi[idx]) {
                    color = '#7aede7';
                } else {
                    color = 'reset';
                }
                break;
            case 'lowerfi':
                lowerfi[idx] = !lowerfi[idx];
                lofi[idx] = false;
                if (lowerfi[idx]) {
                    color = '#24f2c1';
                } else {
                    color = 'reset';
                }
                break;
            default:
                console.warn(`no mode defined for ${mode}`);
        }
        if (color) update_selected_color(idx, color);
    }

    // onMount(() => console.log(canEdit));
</script>

{#each { length: slots } as _, i}
    <div
        class="chip"
        id="chip-{i}"
        style="background-color:{canEdit
            ? $selected_colors_clearing[i]
            : $selected_colors[i]};"
    >
        {#if $selected[i] !== null}
            {#await basename($selected[i], '.wav')}
                <p>loading...</p>
            {:then base}
                <p>{base}</p>
                {#if canEdit}
                    <Button
                        val="Clear"
                        val_color={canEdit
                            ? $selected_colors_clearing[i]
                            : $selected_colors[i]}
                        toggleHook={() => clearSelected(i)}
                    />
                    <Button
                        val="Replace..."
                        val_color={canEdit
                            ? $selected_colors_clearing[i]
                            : $selected_colors[i]}
                        toggleHook={() => updateSelected(null, i)}
                    />
                {:else}
                    <Button
                        val="Lo-Fi"
                        val_color="#595959"
                        val_text_color={$selected_colors[i]}
                        alt_val_color={$selected_colors[i]}
                        toggleHook={() => setColor(i, 'lofi')}
                        condition={lofi[i]}
                    />
                    <Button
                        val="Lower-Fi"
                        val_color="#595959"
                        val_text_color={$selected_colors[i]}
                        alt_val_color={$selected_colors[i]}
                        toggleHook={() => setColor(i, 'lowerfi')}
                        condition={lowerfi[i]}
                    />
                {/if}
            {/await}
        {:else}
            <p>(empty)</p>
            <Button
                val="Import..."
                val_color={canEdit
                    ? $selected_colors_clearing[i]
                    : $selected_colors[i]}
                toggleHook={() => updateSelected(null, i)}
            />
        {/if}
    </div>
{/each}

<style>
    p {
        height: 90px;
        width: 60%;
        max-width: 130px;
        padding: 0 0 0 40%;
        text-overflow: ellipsis;
        overflow: scroll;
        color: #595959;
    }
    .chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        margin: auto;
        height: 200px;
        width: 173px;
        clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%);
    }
</style>

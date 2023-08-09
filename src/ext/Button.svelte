<!-- source: https://svelte.dev/repl/ed4fef4beceb4b0eb295d1f9fdf3bd62?version=3.6.9 -->
<script>
    import { onMount, afterUpdate } from 'svelte';
    export let toggleHook = () => {};
    export let condition = null;
    export let val = '';
    export let val_color = '#e46739';
    export let val_text_color = '#595959';
    export let alt_val = '';
    export let alt_val_color = '#0084f6';
    export let alt_val_text_color = '#595959';
    export let index = -1;
    let text = '';
    let color, text_color;
    $: cssVarStyles = `--val-color:${color};--val-text-color:${text_color}`;

    onMount(() => {
        updateText(condition);
    });

    afterUpdate(() => {
        updateText(condition);
    });

    function updateText(cond) {
        if (cond !== null) {
            text = cond ? val : alt_val === '' ? val : alt_val;
            color = cond ? val_color : alt_val_color;
            text_color = cond ? val_text_color : alt_val_text_color;
        } else {
            text = val;
            color = val_color;
            text_color = val_text_color;
        }
    }

    function toggle() {
        let toggle_bool = toggleHook();
        updateText(toggle_bool);
    }
</script>

<button style={cssVarStyles} tabindex={index} on:click={toggle}>
    {text}
</button>

<style>
    button {
        background-color: var(--val-color, white);
        color: var(--val-text-color, white);
        border: 3px solid transparent;
        border-radius: 4px;
        padding: 0.3rem;
    }
    button:hover,
    button:focus {
        border: 3px solid #e3b976;
    }
    /* :global(body.dark-mode) button {
        background-color: #0084f6;
        color: white;
    } */
</style>

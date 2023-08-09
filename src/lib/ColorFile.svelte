<script>
    export let color, filename;
    export let clickHandler = () => {};
    $: cssVarStyles = `--slot-color:${color};`;
</script>

<p style={cssVarStyles} on:click={clickHandler}>{filename}</p>

<style>
    p {
        margin: 10px;
        height: 30px;
        background-color: var(--slot-color, white);
        border-radius: 7px;
        flex: 1;
    }
    p:hover {
        cursor: pointer;
    }
</style>

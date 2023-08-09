<script>
    import '../scripts/inputKnobs';
    import { afterUpdate } from 'svelte';
    export let name, id, pan, color;
    export let min = 0;
    export let max = 127;
    export let label = 'PAN';
    function validateInput(_e) {
        if (pan > max) {
            pan = max;
        } else if (pan < min) {
            pan = min;
        }
    }
    afterUpdate(async () => {
        setKnob(color);
    });
    function setKnob(color) {
        let el = document.getElementById(name);
        el.setAttribute('data-fgcolor', color);
        try {
            el.refresh();
        } catch (err) {
            if (!err.message.includes('not a function')) {
                console.log(err);
            }
        }
    }
</script>

<div class="flexed">
    <label for={id}><strong>{label}</strong></label>
    <p>
        L <input
            type="range"
            id={name}
            class="input-knob"
            bind:value={pan}
            {min}
            {max}
            step="1"
            data-fgcolor={color}
            data-bgcolor="#d9d9d9"
            data-diameter="32"
        /> R
    </p>
    <input
        class="input_box"
        type="text"
        {id}
        {name}
        bind:value={pan}
        on:change|preventDefault|stopPropagation={validateInput}
    />
</div>

<style>
    .flexed {
        background-color: #a6a6a6;
        padding: 5px;
        justify-content: space-between;
        display: flex;
        flex: row;
    }

    @font-face {
        font-family: 'LCD';
        font-style: normal;
        src: url('/fonts/DS-DIGI.TTF') format('truetype');
    }

    .input_box {
        font-family: LCD;
        background-image: linear-gradient(#d7f5fe, #adedff);
        border-radius: 7px;
        height: 30px;
        width: 45px;
    }

    p {
        margin-top: 25px;
        margin-bottom: -5px;
    }
</style>

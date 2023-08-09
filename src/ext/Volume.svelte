<script>
    export let name, id, vol, color;
    export let min = 0;
    export let max = 127;
    export let label = 'VOL';
    $: cssVarStyles = `--slot-color:${color};`;

    function handleWheel(e) {
        let delta = e.deltaY > 0 ? -0.2 : 0.2;
        updateVolume(delta);
    }
    // given delta, attempts to set volume, but not below min or above max
    function updateVolume(delta) {
        let temp = parseFloat(vol);
        temp += parseFloat(delta);
        if (temp > max) {
            vol = max;
        } else if (temp < min) {
            vol = min;
        } else {
            vol = parseFloat(temp.toFixed(2));
        }
    }
    function validateInput(_e) {
        if (vol > max) {
            vol = max;
        } else if (vol < min) {
            vol = min;
        }
    }
    function highlightElem(e) {}
</script>

<div class="flexed">
    <label for={id}><strong>{label}</strong></label>

    <div class="fader-container" style={cssVarStyles}>
        <input
            id="fader"
            type="range"
            {min}
            {max}
            step="0.2"
            bind:value={vol}
            on:focus={highlightElem}
            on:wheel|preventDefault={handleWheel}
        />
    </div>
    <input
        class="input_box"
        type="text"
        {id}
        {name}
        bind:value={vol}
        on:change|preventDefault|stopPropagation={validateInput}
    />
</div>

<style>
    .flexed {
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
        /* position: fixed; */
        font-family: LCD;
        background-image: linear-gradient(#d7f5fe, #adedff);
        border-radius: 7px;
        height: 30px;
        width: 45px;
    }

    .fader-container {
        display: inline-block;
        width: 20px;
        height: 150px;
        padding-bottom: 7px;
    }

    #fader {
        -webkit-appearance: none;
        width: 150px;
        height: 7px;
        padding: 0;
        margin: 0;
        transform-origin: 75px 75px;
        transform: rotate(-90deg);
        background-color: dimgray;
    }

    #fader::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        width: 5px;
    }

    #fader::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 30px;
        height: 20px;
        background-color: var(--slot-color, white);
        border-radius: 8px;
    }
</style>

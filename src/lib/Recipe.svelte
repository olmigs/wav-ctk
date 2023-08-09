<script>
    import Button from '../ext/Button.svelte';
    import { FileMonitor } from '../recipe';
    import { onMount } from 'svelte';

    export let renderer, state;

    const mon = new FileMonitor(state.dir, state.ext);

    let files = [];
    let fileChanged = false;
    let renderedFile, renderedFileContents;
    // migstodo: of dubious use
    let fileCtrl = true;
    // $: fileCtrl = renderedFile && renderedFileContents;

    onMount(async () => {
        await mon.start();
        files = await mon.readDir();
        if (state.def) {
            getContent({ name: state.def });
        }
    });

    function findListElemToHighlight() {
        let lis = document.getElementsByTagName('li');
        for (let li of lis) {
            // console.log(li.textContent);
            if (li.textContent === renderedFile.name) {
                li.classList.add('picked');
            } else {
                li.classList.remove('picked');
            }
        }
    }

    function getContent(file) {
        mon.readFile(file.name).then((content) => {
            renderedFile = file;
            renderedFileContents = content;
            inputMd(content);

            findListElemToHighlight();
        });
    }

    function inputMd(md) {
        let mdEl = document.getElementById(state.id);
        let inputEvent = new Event('input');
        if (md) {
            // @ts-ignore
            mdEl.value = md;
            mdEl.dispatchEvent(inputEvent);
        }
        // @ts-ignore
        mdEl.value += '';
        mdEl.dispatchEvent(inputEvent);
    }
</script>

<svelte:window on:resize={(_ev) => inputMd()} />

<main>
    <span>
        <ul>
            <h2>{state.h2}</h2>

            {#each files as file}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li on:click={() => getContent(file)}>{file.name}</li>
            {/each}
        </ul>
    </span>

    <span>
        <span style="visibility: {fileCtrl ? 'visible' : 'hidden'};">
            <Button
                val="Save"
                alt_val_text_color="white"
                condition={fileChanged}
                toggleHook={() => {
                    let mdEl = document.getElementById('markdown');
                    console.log(mdEl);
                    if (!mdEl) {
                        mdEl = document.getElementById('cooklang'); // dumb
                    }
                    mon.writeFileCopy(renderedFile, mdEl.value);
                    fileChanged = false;
                    renderedFileContents = mdEl.value;
                }}
            />
        </span>
        <p />
        <svelte:component
            this={renderer}
            mdId={state.id}
            on:contents={(e) => {
                fileChanged = !(e.detail === renderedFileContents);
            }}
            on:metadata={(e) => console.log(e.detail)}
        />
    </span>
</main>

<style>
    main {
        width: 90vw;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    li {
        min-width: 125px;
        margin: 20px;
    }

    li:hover {
        cursor: pointer;
        font-weight: bold;
        /* migscolor */
        color: #f0bfed;
    }
</style>

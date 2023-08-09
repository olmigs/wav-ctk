<script>
    import RenderCook from '../../../../js/scripts/components/Recipe/Render2.svelte';
    import RenderMd from '../../../../js/scripts/components/Recipe/Render.svelte';
    import Recipe from './Recipe.svelte';
    import Wave from '../Wave.svelte';
    import Tabs from '../ext/Tabs.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { startLogging } from '../utils';

    // List of tab items with labels, values and assigned components
    let items = [
        {
            label: 'Wave CTK',
            value: 3,
            component: Wave,
        },
        {
            label: 'Cooklang',
            value: 1,
            component: Recipe,
            renderer: RenderCook,
            state: {
                dir: 'dev/js/scripts/components/Recipe/cook',
                ext: '.cook',
                md: false,
                id: 'cooklang',
                h2: 'recipes',
                def: 'pickled-onions.cook',
            },
        },
        {
            label: 'Notes',
            value: 2,
            component: Recipe,
            renderer: RenderMd,
            state: {
                dir: 'dev/js/scripts/components/Recipe/cook',
                ext: '.migs',
                md: true,
                id: 'markdown',
                h2: 'notes',
                def: 'wav-ctk.migs',
            },
        },
    ];

    let detach = () => {};

    onMount(async () => {
        detach = await startLogging();
    });

    onDestroy(detach);
</script>

<Tabs {items} activeTabValue={3} />

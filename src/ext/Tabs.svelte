<script>
    import { createEventDispatcher } from 'svelte';

    export let items = [];
    export let activeTabValue = 1;

    let dispatch = createEventDispatcher();

    const handleClick = (tabValue) => () => {
        dispatch('wasWhenClicked', activeTabValue);
        activeTabValue = tabValue;
    };
</script>

<ul>
    {#each items as item}
        <li class={activeTabValue === item.value ? 'active' : ''}>
            <span on:click={handleClick(item.value)}>{item.label}</span>
        </li>
    {/each}
</ul>
{#each items as item}
    {#if activeTabValue == item.value}
        <div class="box">
            <svelte:component
                this={item.component}
                renderer={item.renderer}
                state={item.state}
            />
        </div>
    {/if}
{/each}

<style>
    .box {
        margin-bottom: 10px;
        padding: 40px;
        border-top: 1px solid #f0bfed;
        border-radius: 0 0 0.5rem 0.5rem;
        /* border-top: 0; */
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
        border-bottom: 1px solid #f0bfed;
    }
    li {
        color: #efeff5;
        font-weight: bold;
        margin-bottom: -1px;
    }

    span {
        border: 1px solid transparent;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        display: block;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    span:hover {
        border-color: #f0bfed #f0bfed #f0bfed;
    }

    li.active > span {
        color: #495057;
        background-color: #f0bfed;
        border-color: #f0bfed #f0bfed #f0bfed;
    }
</style>

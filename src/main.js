import './styles.css';

// import App from "./App.svelte";
import App from './Wave.svelte';
// import App from './lib/RecipeDev.svelte';

const app = new App({
    target: document.getElementById('app'),
});

export default app;

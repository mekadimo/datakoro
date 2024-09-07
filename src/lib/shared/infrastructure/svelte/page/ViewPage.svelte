<script lang="ts">
    import TopBar from "../section/TopBar.svelte";

    export let data: {
        testResults: {
            concept_id: string;
            text_value: string;
            transaction_date: Date;
        }[];
    };
</script>

<TopBar isFixed={true} showLogotype={true} />
<section class="section datakoro-view">
    <table class="table">
        <thead>
            <th>ID</th>
            <th>TEXT</th>
            <th>DATE</th>
        </thead>
        <tbody>
            {#each data.testResults as testResult}
                <tr>
                    <td>
                        <code>{testResult.concept_id}</code>
                    </td>
                    <td>{testResult.text_value}</td>
                    <td>{testResult.transaction_date}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<style lang="scss">
    .datakoro-view {
        padding: 56px 0 0 0;
        // TODO: Use full screen height as min height
    }
</style>

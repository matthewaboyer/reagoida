<script lang="ts">
    export let SongData: [number, string, string, string, string] | number
</script>

<div id="container">
    {#if typeof SongData === "object"}
        <img id="cover" src="{SongData[4]}" alt="{SongData[2]}"/>
        <div id="info_container">
            <h2 id="title">{SongData[2]}</h2>
            <h4 id="artist">{SongData[3]}</h4>
            <p id="extra">Requester: {SongData[1]}, ID: {SongData[0]}</p>
        </div>
    {:else}
        <p>Loading {SongData}...</p>
    {/if}
</div>

<style>
    #container {
        margin: 8px;
        padding: 8px;
        background-color: #F0F0F0;
        border-radius: 16px;
        display:flex;
        align-items:center;
    }

    #cover {
        display: inline-block;
        width: 128px;
        height: 128px;
        border-radius: 16px;
    }

    #info_container {
        display: inline-block;
        margin-left: 16px;
    }

    #title {
        margin-top: 0;
        margin-bottom: 4px;
        font-family: Helvetica, serif;
    }

    #artist {
        margin-top: 4px;
        margin-bottom: 16px;
        font-family: Helvetica, serif;
    }

    #extra {
        margin-top: 16px;
        margin-bottom: 0;
        font-family: Helvetica, serif;
    }
</style>
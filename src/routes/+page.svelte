<script>
    import {io} from 'socket.io-client'
    import Song from './Song.svelte'
    import {onMount} from 'svelte'

    export let data

    let messages = data.messages
    let offset = data.offset
    let songs = data.songs

    const socket = io('ws://:3000')
    socket.on('server_message', (message) => {messages = [message, ...messages]})
    socket.on('server_add', (song) => {songs = song})

    onMount(() => {
        console.log(songs)
    })
</script>

<main>
    <div id="container">
        <div id="next_container">
            {#if songs[offset] !== undefined}
                {#if typeof songs[offset] === "object"}
                    <div>
                        <img id="next_cover" src="{songs[offset][4]}" alt="{songs[offset][2]}"/>
                        <div id="next_content">
                            <h2 id="next_title">{songs[offset][2]}</h2>
                            <h4 id="next_artist">{songs[offset][3]}</h4>
                            <p id="next_extra">Requester: {songs[offset][1]}, ID: {songs[offset][0]}</p>
                            <div id="next_actions">
                                <a id="next_open" href="music://music.apple.com/us/song/{songs[offset][0]}">
                                    Open in Apple Music
                                </a>
                                <button id="next_next" on:click={() => {
                                    socket.emit('client_next')
                                    offset++
                                }}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                {:else}
                    <p id="next_loading">Loading...</p>
                {/if}
            {/if}
        </div>
        <div id="songs_container">
            {#if songs.length > offset + 1}
                {#each songs.slice(offset + 1) as song}
                    <Song SongData={song}/>
                {/each}
            {:else}
                <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center">
                    <h2 style="font-family: Helvetica, serif">Nothing in queue</h2>
                </div>
            {/if}
        </div>
        <div id="messages_container">
            {#if messages.length > 0}
                {#each messages as message}
                    <p class="message">{message[0]}: {message[1]}</p>
                {/each}
            {:else}
                <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center">
                    <h2 style="font-family: Helvetica, serif">No messages</h2>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    #container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }

    #next_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #next_cover {
        display: block;
        width: 256px;
        height: 256px;
        border-radius: 16px;
        margin-left: auto;
        margin-right: auto;
    }

    #next_content {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    #next_title,
    #next_artist,
    #next_extra {
        font-family: Helvetica, serif;
        width: auto;
        margin: 4px auto;
    }

    #next_extra {margin-top: 12px;}

    #next_actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        height: 48px;
        font-family: Helvetica, serif;
        margin: 16px auto;
        width: 256px;
    }

    #next_open {
        grid-column-end: span 2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        border-radius: 16px;
        background: #F0F0F0;
    }

    #next_next {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 5px;
        border-radius: 16px;
        background: #F0F0F0;
    }

    #next_loading {
        font-family: Helvetica, serif;
    }

    #songs_container {
        overflow-y: auto;
        height: 100vh;
    }

    #messages_container {
        overflow-y: auto;
        height: 100vh;
        display: flex;
        flex-direction: column-reverse;
    }

    .message {
        font-family: Helvetica, serif;
        margin: 8px 16px;
    }
</style>
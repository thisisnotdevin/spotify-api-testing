const clientId = "1b83175bd5684631bfb8f7e8d288a341"; 
const params = new URLSearchParams(window.location.search);
const code = params.get("code");


if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const Tracks = await fetchTracks(accessToken)
    
    // console.log(profile);
    // console.log(Tracks);
    populateUI(profile);
    populateTracks(Tracks)
}

export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracks(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=40&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

  
function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }

    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
    document.getElementById("followers")!.innerText = profile.followers.total;
    document.getElementById("country")!.innerText = profile.country;
    document.getElementById("product")!.innerText = profile.product;
    document.getElementById("type")!.innerText = profile.type;
}

let currentlyPlaying: HTMLAudioElement | null = null;

function playSong(audioPlayer: HTMLAudioElement) {
  if (currentlyPlaying && currentlyPlaying !== audioPlayer) {
    currentlyPlaying.pause();
    currentlyPlaying.currentTime = 0;
  }
  currentlyPlaying = audioPlayer;
  audioPlayer.play();
  audioPlayer.volume = 0.2;
}

function createSongContainer(track: any) {
    const songContainer = document.createElement("div");
  
    const songNameElement = document.createElement("span");
    songNameElement.innerText = track.name;

    const artistNameElement = document.createElement("p");
    artistNameElement.innerText = track.album.artists[0].name;

    const songImg = document.createElement("img");
    songImg.src = track.album.images[1].url;
    songImg.style.objectFit = "cover";

    const audioPlayer = document.createElement("audio");
    const audioSource = document.createElement("source");
    if (track.preview_url) {
        audioSource.src = track.preview_url;
    }
    audioPlayer.appendChild(audioSource);

    const playButton = document.createElement("button");
    if (!track.preview_url) {
        playButton.innerText = "Preview not available";
    }
    else {
        playButton.innerText = "Play Preview";
        playButton.onclick = function() {
            playSong(audioPlayer);
        };
    }

    songContainer.appendChild(audioPlayer);
    songContainer.appendChild(songImg);
    songContainer.appendChild(songNameElement);
    songContainer.appendChild(artistNameElement);
    songContainer.appendChild(playButton);

    return songContainer;
}

function populateTracks(tracks: any) {
    const songContainer = document.getElementById("songContainer");
    for (let i = 0; i < 40; i++) {
        const song = tracks.items[i];
        const songContainerElement = createSongContainer(song);
        songContainer!.appendChild(songContainerElement);
    }
}

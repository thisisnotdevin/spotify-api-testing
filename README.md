# spotify-api-testing

[Spotify web api](https://developer.spotify.com/documentation/web-api)

This project's objective is to develop a thorough understanding of how the Spotify API should be used. The goal of this project is to create a Spotify Top Tracks project that retrieves and shows a user's most-heard songs over the previous six months. Users can refresh their memories of their favorite musical compositions from the previous six months by cloning this project. The project aims to improve coding abilities as well as knowledge of additional Spotify API requirements.

In this project, students will learn how to create access tokens, configure authentication, and use those tokens to send requests to the Spotify API. Along with understanding the various access permissions needed for accessing Spotify data and features, they will learn how to interpret the responses and error messages returned by the API.

## Notes
![image](https://user-images.githubusercontent.com/66978846/232624859-5c8a8e89-8648-47fa-8f76-f8ae38ba6494.png)

Tools:

  <a href="">
    <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma logo">
  </a>
  <a href="">
    <img src="https://img.shields.io/badge/Spotify-1ED760?&style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify logo">
  </a>



### Requesting top track data from spotify

We're going to use the response from the `getAccessToken()` function above to securely request your top tracks. This assumes you added the user-top-read scope during the Authentication Phase.

## `getTopTracks` function
This code exports an asynchronous function `getTopTracks` that sends an HTTP request to the Spotify API to retrieve a user's top tracks using an access token retrieved from another function getAccessToken.

```typescript
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`

export const getTopTracks = async () => {
  const { access_token } = await getAccessToken()

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}
```
## `Spotify API requests`
These two codes define two asynchronous functions, `fetchProfile` and `fetchTracks`, that send HTTP GET requests to the Spotify API to retrieve the user's profile and top tracks data respectively, using an access token passed as an argument. The response data is returned in JSON format.

```typescript
async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTracks(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}
```
## `Spotify authorization code flow`
This code exports an asynchronous function `redirectToAuthCodeFlow` that generates a code verifier and challenge, stores the verifier in local storage, appends query parameters to a URL, and redirects the user's browser to the Spotify Authorization endpoint for the authorization code flow with the generated URL parameters appended as query string parameters. The user is prompted to log in and authorize the requested permissions, and if successful, is redirected to a specified callback URL with the authorization code as a query parameter.

```typescript
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
```

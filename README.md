# spotify-api-testing

## Notes

![image](https://user-images.githubusercontent.com/66978846/232128395-ec1a0a48-339d-4d6a-9ea8-f4af06c7fd64.png)

### Requesting top track data from spotify

We're going to use the response from the getAccessToken() function above to securely request your top tracks. This assumes you added the user-top-read scope during the Authentication Phase.

```
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

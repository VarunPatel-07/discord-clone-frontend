//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwMjBhNjllZC04ZmMzLTQ5NmEtYjk1Ny01NmQ4NWVlZmYxODUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyMzYzOTA4NywiZXhwIjoxNzI0MjQzODg3fQ.b8mpfwCCDugvvic2qblsQRyk7poY9mPzM4PkxPr_-YU";

// API call to create a meeting
export const createMeeting = async ({ token }: { token: string }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId }: { roomId: string } = await res.json();
  return roomId;
};

# Code Collab

A realtime collaborative code editor with built-in chat and video call.

![1](https://user-images.githubusercontent.com/57309472/128317064-cf96c3be-a4e5-4517-9803-3a30f6b68b2a.PNG)
![2](https://user-images.githubusercontent.com/57309472/128317078-5945a26b-a810-46bb-aacb-0e68a1d8aa37.PNG)
![3](https://user-images.githubusercontent.com/57309472/128317082-29a4e7ff-9fe5-4441-ad7b-1036507be66f.PNG)

## How I made it

I uses socket.io to exchange realtime data.

### Code Editor

I used CodeMirror to implement the code editor. It comes with a number of languages and themes that a user can choose. The code(data) that is written in the editor is then pass/exchange using socket.io. To save the code that was written in the editor, I store it in MongoDB database.

### Video Chat

I used the simple-peer library to implement the video chat. Simple peer simplifies WebRTC's peer-to-peer video data exchange. Since it is only peer-to-peer, to implement more than 2 peers connection, I need to create an array and store all the users in that array, and map them individually to connect each one to other users. The video-stream, audio, and peer connection/signal are pass/exchange using socket.io.

### Chat

I simply used the HTML input tag to let the user to type some message, and when he/she hit the enter key, I will then pass the text using socket.io.

### Authentication

I used Google and Facebook oauth so that users will not create another account. Another account means another username and password to memorize.

### Styling

I used SCSS to implement the styling of the application.

## Built With

- [CodeMirror](https://codemirror.net/)
- [WebRTC](https://webrtc.org/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [ExpressJS](https://expressjs.com/)
- [NodeJS](https://nodejs.org/en/)
- [ReactJS](https://rometools.github.io/rome/)

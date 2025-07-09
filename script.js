let localStream;
let peer;
let call;
const talkBtn = document.getElementById('talk');

// Captura o microfone e desativa por padrão
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  localStream = stream;
  localStream.getAudioTracks()[0].enabled = false;
}).catch(err => {
  alert("Erro ao acessar o microfone: " + err.message);
});

// Criar sala
document.getElementById('host').onclick = () => {
  const roomId = document.getElementById('room').value.trim();
  if (!roomId) return alert("Digite o nome da sala");

  peer = new Peer(roomId, {
    host: '0.peerjs.com',
    secure: true,
    port: 443,
    path: '/'
  });

  peer.on('open', id => {
    console.log("Sala criada:", id);
    alert("Sala criada! Outro usuário pode entrar com esse nome.");
  });

  peer.on('call', incomingCall => {
    incomingCall.answer(localStream);

    incomingCall.on('stream', remoteStream => {
      document.getElementById('remoteAudio').srcObject = remoteStream;
      talkBtn.disabled = false;
    });
  });

  peer.on('error', err => {
    console.error("Erro no Peer:", err);
    alert("Erro: " + err.message);
  });
};

// Entrar na sala
document.getElementById('join').onclick = () => {
  const roomId = document.getElementById('room').value.trim();
  if (!roomId) return alert("Digite o nome da sala");

  peer = new Peer(undefined, {
    host: '0.peerjs.com',
    secure: true,
    port: 443,
    path: '/'
  });

  peer.on('open', id => {
    call = peer.call(roomId, localStream);

    call.on('stream', remoteStream => {
      document.getElementById('remoteAudio').srcObject = remoteStream;
      talkBtn.disabled = false;
    });
  });

  peer.on('error', err => {
    console.error("Erro no Peer:", err);
    alert("Erro: " + err.message);
  });
};

// Push-to-talk
talkBtn.onmousedown = () => {
  if (localStream) localStream.getAudioTracks()[0].enabled = true;
};
talkBtn.onmouseup = () => {
  if (localStream) localStream.getAudioTracks()[0].enabled = false;
};
talkBtn.onmouseleave = () => {
  if (localStream) localStream.getAudioTracks()[0].enabled = false;
};

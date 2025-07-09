let localStream;
let peer;
let call;
const talkBtn = document.getElementById('talk');
const startSound = document.getElementById('startSound');
const endSound = document.getElementById('endSound');

// Captura o microfone e desativa por padrão
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  localStream = stream;
  localStream.getAudioTracks()[0].enabled = false;
}).catch(err => {
  alert("Erro ao acessar o microfone: " + err.message);
});

// ID
document.getElementById('host').onclick = () => {
  const roomId = document.getElementById('room').value.trim();
  if (!roomId) return alert("Digite o ID");

  peer = new Peer(roomId, {
    host: '0.peerjs.com',
    secure: true,
    port: 443,
    path: '/'
  });

  peer.on('open', id => {
    console.log("ID criado:", id);
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
  if (!roomId) return alert("Digite o ID");

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

// Funções para ativar/desativar microfone com som
function ativarMicrofone() {
  if (localStream) {
    localStream.getAudioTracks()[0].enabled = true;
    startSound.currentTime = 0;
    startSound.play().catch(() => {}); // evita erro de autoplay
    console.log("🎤 Microfone ativado");
  }
}

function desativarMicrofone() {
  if (localStream) {
    localStream.getAudioTracks()[0].enabled = false;
    endSound.currentTime = 0;
    endSound.play().catch(() => {});
    console.log("🔇 Microfone desativado");
  }
}

// Eventos desktop
talkBtn.addEventListener('mousedown', ativarMicrofone);
talkBtn.addEventListener('mouseup', desativarMicrofone);
talkBtn.addEventListener('mouseleave', desativarMicrofone);

// Eventos mobile
talkBtn.addEventListener('touchstart', e => {
  e.preventDefault();
  ativarMicrofone();
});
talkBtn.addEventListener('touchend', e => {
  e.preventDefault();
  desativarMicrofone();
});

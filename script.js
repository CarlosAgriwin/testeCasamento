// Firebase Configuration (substitua pelos seus valores do Firebase Console)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialize o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Referências ao DOM
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('upload');
const progressDiv = document.getElementById('progress');
const fileList = document.getElementById('fileList');

// Função para fazer upload de arquivos
uploadButton.addEventListener('click', () => {
  const files = fileInput.files;

  if (!files.length) {
    alert('Selecione pelo menos uma foto para carregar.');
    return;
  }

  for (const file of files) {
    uploadFile(file);
  }
});

function uploadFile(file) {
  const storageRef = ref(storage, `uploads/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Atualiza o progresso do upload
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressDiv.innerText = `Progresso: ${Math.round(progress)}%`;
    },
    (error) => {
      console.error('Erro ao carregar o arquivo:', error);
    },
    async () => {
      // Obtém o URL de download quando o upload termina
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      displayFileLink(file.name, downloadURL);
    }
  );
}

function displayFileLink(fileName, url) {
  const listItem = document.createElement('li');
  const link = document.createElement('a');
  link.href = url;
  link.innerText = fileName;
  link.target = '_blank';
  listItem.appendChild(link);
  fileList.appendChild(listItem);
}

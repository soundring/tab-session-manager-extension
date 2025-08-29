document.getElementById('saveBtn').addEventListener('click', async () => {
  const nameInput = document.getElementById('sessionName');
  const sessionName = nameInput.value.trim();
  if (!sessionName) {
    alert('Please enter a session name');
    return;
  }
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const urls = tabs.map(tab => tab.url);
  chrome.storage.local.get({ sessions: [] }, ({ sessions }) => {
    sessions.push({ name: sessionName, urls });
    chrome.storage.local.set({ sessions }, () => {
      nameInput.value = '';
      renderSessions();
    });
  });
});

function renderSessions() {
  chrome.storage.local.get({ sessions: [] }, ({ sessions }) => {
    const container = document.getElementById('sessions');
    container.innerHTML = '';
    sessions.forEach((session, index) => {
      const div = document.createElement('div');
      div.className = 'session-item';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = session.name + ' ';
      const restoreBtn = document.createElement('button');
      restoreBtn.textContent = 'Restore';
      restoreBtn.addEventListener('click', () => {
        chrome.windows.create({ url: session.urls });
      });
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        sessions.splice(index, 1);
        chrome.storage.local.set({ sessions }, renderSessions);
      });
      div.appendChild(nameSpan);
      div.appendChild(restoreBtn);
      div.appendChild(deleteBtn);
      container.appendChild(div);
    });
  });
}

document.addEventListener('DOMContentLoaded', renderSessions);

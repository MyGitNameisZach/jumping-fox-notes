/* controls popup when creating new note or editing*/
function popup() {
  const popupContainer = document.createElement('div');
  popupContainer.innerHTML = `
    <div id="popupContainer">
    <h1> New Note</h1>
    <textarea id ="note-text" placeholder="Enter New Note..."></textarea>
    <div id="btn-container">
    <button id="submitBtn" onclick="createNote()">Create Note</button>
    <button id="closeBtn" onclick="closePopup()">Close</button>
</div>
</div>
    `;
  document.body.appendChild(popupContainer);
}
/*connected to our close button this removes popup off the screen*/
function closePopup() {
  const popupContainer = document.getElementById('popupContainer');
  if (popupContainer) {
    popupContainer.remove();
  }
}
/*connected to the create note div
 gets whats in text area and saves it, adding to existing notes
 pushing new note onto display*/
function createNote() {
  const popupContainer = document.getElementById('popupContainer');
  const noteText = document.getElementById('note-text').value;
  if (noteText.trim() !== '') {
    const note = {
      id: new Date().getTime(),
      text: noteText,
    };
    const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
    existingNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(existingNotes));
    document.getElementById('note-text').value = '';

    popupContainer.remove();
    displayNotes();
  }
}
/* shows notes on container with edit and garbage button*/
function displayNotes() {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '';

  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  notes.forEach((note) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span> ${note.text}</span>
        <div id="noteBtns-container">
        <button id = "editBtn" onclick="editNote(${note.id})"><i
        class="fa-solid fa-pen"></i></button>
        <button id = "deleteBtn" onclick="deleteNote(${note.id})"><i
        class="fa-solid fa-trash"></i></button>
</div>
`;
    notesList.appendChild(listItem);
  });
}
/*edit note btn bring us here allowing us to change text already saved*/
function editNote(noteId) {
  const existingPopup = document.getElementById('editing-container');
  if (existingPopup) {
    existingPopup.remove();
  }

  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const noteToEdit = notes.find((note) => note.id === noteId);
  const noteText = noteToEdit ? noteToEdit.text : '';
  const editingPopup = document.createElement('div');

  editingPopup.innerHTML = `
    <div id ="editing-container" data-note-id="${noteId}">
    <h1>Edit Note</h1>
    <textarea id ="note-text">${noteText}</textarea>
        <div id = "btn-container">
        <button id ="submitBtn" onclick="updateNote()">Done</button>
        <button id ="closeBtn" onclick="closeEditPopup()">Cancel</button>
        </div>
</div>
`;
  document.body.appendChild(editingPopup);
}
/* close btn on edit popup*/
function closeEditPopup() {
  const editingPopup = document.getElementById('editing-container');
  if (editingPopup) {
    editingPopup.remove();
  }
}
/* connected to edit note done btn
makes sure everything is saved correctly to note id
updates notes on display*/
function updateNote() {
  const noteText = document.getElementById('note-text').value.trim();
  const editingPopup = document.getElementById('editing-container');
  if (noteText !== '') {
    const noteId = Number(editingPopup.getAttribute('data-note-id'));
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        return { id: note.id, text: noteText };
      }
      return note;
    });
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    editingPopup.remove();

    displayNotes();
  }
}
/*trashes note from local storage and removes from display*/
function deleteNote(noteId) {
  noteId = Number(noteId);
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes = notes.filter((note) => note.id !== noteId);

  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

displayNotes();

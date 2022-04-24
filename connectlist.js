////.... API ....////
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com';
const INDEX_URL = BASE_URL + '/api/v1/users';
const ID_URL = BASE_URL + '/api/v1/users/';

////.... Declear variable ....////
const users = JSON.parse(localStorage.getItem('Connect_List')) || [];

////.... Query selectors ....////
const dataPanel = document.getElementById('data-panel');

////.... Function ....////
function renderUserList(data, pageNum) {
  let usersDataDOM = '';
  data.forEach((user) => {
    usersDataDOM += `
        <div class="col-sm-3">
          <div class="m-2">
            <div class="card text-center border-secondary">
              <button
                type="button"
                class="btn btn-outline-light btn-show-user-information"
                data-bs-toggle="modal"
                data-bs-target="#user-modal"
                data-id="${user.id}"
              >
                <img
                  src="${user.avatar}"
                  class="card-img-top rounded-circle"
                  alt="Dr. ${user.name} ${user.surname} avatar"
                  data-id="${user.id}"
                />
              </button>
              <div class="card-body">
                <blockquote class="blockquote">
                  Dr. ${user.surname}
                  <i
                    type="button"
                    class="btn btn-sm btn-outline-secondary m-1 fas fa-user-times"
                    id="remove-from-connect-list-btn"
                    data-id="${user.id}"
                  ></i>
                </blockquote>
                <figcaption class="blockquote-footer">
                  <strong>${medicalSpecialists()}</strong>
                </figcaption>
              </div>
              <div class="card-footer">
                <i class="fas fa-map-marker-alt"> ${user.region}</i>
              </div>
            </div>
          </div>
        </div>
    `;
  });

  dataPanel.innerHTML += `<div id="page-${pageNum}" class="d-flex flex-row flex-wrap">${usersDataDOM}</div>`;
}

// Show each doctor's specialist
// Only used by renderUserList
function medicalSpecialists() {
  const specialists = [
    'Allergist',
    'Dermatologist',
    'Podiatrist',
    'General Practitioner',
    'Pediatrician',
    'Endocrinologist',
    'Neurologist',
    'Rheumatologist',
    'Psychiatrist',
    'Nephrologist',
    'Gynecologist',
    'Pulmonologist',
    'Surgeon',
    'Emergency Physician',
    'Ophthalmologist',
    'Oncologist',
    'Urologist',
    'Otolaryngologist',
    'Anesthesiologist',
    'Radiologist',
    'Gastroenterologist',
    'Cardiologist',
    'Orthopedist',
  ];

  const index = Math.floor(Math.random() * specialists.length);
  return specialists[index];
}

// Modal Function: show the detail information on clicked card
function showUserModal(id) {
  const modalName = document.querySelector('#modal-user-name');
  const modalAvatar = document.querySelector('#modal-user-avatar');
  const modalRegion = document.querySelector('#modal-user-region');
  const modalEmail = document.querySelector('#modal-user-email');

  axios
    .get(ID_URL + id)
    .then((response) => {
      const data = response.data;
      modalName.innerHTML = `Dr. ${data.name} ${data.surname}`;
      modalAvatar.innerHTML = `<img src="${data.avatar}" class="img-fluid rounded-circle" alt="Dr.-${data.name}-${data.surname}-avatar">`;
      modalRegion.innerHTML = `<i class="fas fa-map-marker-alt">  ${data.region}</i>`;
      modalEmail.innerHTML = `<i class="fas fa-envelope">  ${data.email}</i>`;
    })
    .catch((error) => console.log(error));
}

// Remove namecard from connect list
function removeFromConnectList(id) {
  if (!users || !users.length) return;

  const indexInArray = users.findIndex((namecard) => namecard.id === id);
  if (indexInArray === -1) return;
  users.splice(indexInArray, 1);

  localStorage.setItem('Connect_List', JSON.stringify(users));

  renderUserList(users);
}

////.... Event Listener ....////
dataPanel.addEventListener('click', function onAvatarClicked(event) {
  // use Element.closest instead of Element.matches to travers the Element AND its parents
  if (event.target.closest('.btn-show-user-information')) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('#remove-from-connect-list-btn')) {
    removeFromConnectList(Number(event.target.dataset.id));
  }
});

renderUserList(users);

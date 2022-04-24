////.... API ....////
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com';
const INDEX_URL = BASE_URL + '/api/v1/users';
const ID_URL = BASE_URL + '/api/v1/users/';

////.... Declear Variable ....////
// save all users' data
const users = [];
const NAMECARD_PER_PAGE = 8;

////.... QuerySelector Node ....////
const dataPanel = document.querySelector('#data-panel');
const pageList = document.getElementById('sticky-page-list-group');

////.... Function ....////
// Render namecards
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
                    class="btn btn-sm btn-outline-secondary m-1 fas fa-user-plus"
                    id="add-to-connect-list-btn"
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
// Modal Function: show user's detail information
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

// Add the user with the id on clicked icon to connect list
function addUserToConnectList(id) {
  const connectList = JSON.parse(localStorage.getItem('Connect_List')) || [];
  const getClickedUserData = users.find((user) => user.id === id);
  if (connectList.some((connect) => connect.id === id)) {
    return alert('The doctor is already in your connect list!');
  }
  connectList.push(getClickedUserData);
  localStorage.setItem('Connect_List', JSON.stringify(connectList));
}

// 切分每頁顯示的資料
// return 8 user data
// global users array pass into this function
function sliceUsersArray(users, page) {
  const startIndex = (page - 1) * NAMECARD_PER_PAGE;
  return users.slice(startIndex, startIndex + NAMECARD_PER_PAGE);
}
// 確切知道分幾頁
// namecardAmount = users.length
// totalPages = users.length / NAMECARD_PER_PAGE
function renderPageList(dataAmount) {
  const totalPages = Math.ceil(dataAmount / NAMECARD_PER_PAGE);

  let innerPageList = '';
  for (let page = 1; page <= totalPages; page++) {
    innerPageList += `
    <a class="list-group-item list-group-item-action" href="#page-${page}">${page}</a>
    `;
  }
  pageList.innerHTML = innerPageList;
}

////.... Add Event Listener ....////
dataPanel.addEventListener('click', function onAvatarClicked(event) {
  // use Element.closest instead of Element.matches to travers the Element AND its parents
  if (event.target.closest('.btn-show-user-information')) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('#add-to-connect-list-btn')) {
    addUserToConnectList(Number(event.target.dataset.id));
  }
});

////.... Get API with axios ....////
// Get all users' data and put it into array users
// Render users
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results.slice(0, 88));
    // User List
    // reder user list recursively
    const totalPages = Math.ceil(users.length / NAMECARD_PER_PAGE);
    for (let pageID = 1; pageID <= totalPages; pageID++) {
      renderUserList(sliceUsersArray(users, pageID), pageID);
    }
    // Paginator
    renderPageList(users.length);
  })
  .catch((error) => console.log(error));

// import {exams} from '../data/exams.js';
import {get_subject} from '../data/subjects.js';
import {get_user} from '../data/users.js';

let exams = [];
let data = await call_get_exams_api();
if (data.ok) {
  exams = data.data;
  intitialize_elements();
  renderSubjectsFilter();
  render_exams_table(exams);
}
else 
  console.log("Error fetching exams: " + data.status + " " + data.statusText);


async function intitialize_elements()
{
  let div = await document.getElementById('topNavRight');
  console.log(div);

  let userId = "1"; // TODO: get logged in user id
  div.innerHTML += `
    <a href="profile.html?id=${userId}" class="profile-button">
      <div class="profile-icon">U</div>
      <span>Profile</span>
    </a>
  `;

  let searchBtn= await document.getElementById('searchBtn');

  await searchBtn.addEventListener('click', async () => {
    await filterTable();
  });

  // let subjectFilter = document.getElementById('subjectFilter');

  // subjectFilter.addEventListener('change', () => {
  //   filterTable();
  // });
}

async function filterTable()
{
  let searchInput = document.getElementById('searchInput').value;
  let subjectFilter = document.getElementById('subjectFilter').value

  console.log("Filtering with search: " + searchInput + " and subject: " + subjectFilter);

  let filteredExams = await call_get_exams_api(searchInput, subjectFilter);

  console.log(filteredExams);

  render_exams_table(filteredExams.data);
}

function render_exams_table(table) {
  const tableBody = document.getElementById('tableBody');
  let html = ``;

  if (!table || table.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="no-results">No exams found</td></tr>';
    return;
  }

  table.forEach(exam => {
    html += `
      <tr class="exam-row" data-id="${exam.id}">
          <td data-label="Subject"><span class="subject-tag subject-programming">${exam.subject.name}</span></td>
          <td data-label="Title">${exam.title}</td>
          <td data-label="User"><span class="user-name">${exam.createdBy.userName}</span></td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;

  const rows = document.querySelectorAll('.exam-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const examId = row.getAttribute('data-id');
      window.location.href = `exam_details.html?id=${examId}`;
    });
  });
}

async function renderSubjectsFilter() {
  let subjects = (await call_get_subjects_api()).data;
  const subjectFilter = document.getElementById('subjectFilter');
  
  subjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject.id;
    option.textContent = subject.name;
    subjectFilter.appendChild(option);
  });
}
async function call_get_exams_api(filter = "", subjectFilter = "-1")
{
  const url = `https://localhost:7052/api/Exam?filter=
  ${encodeURIComponent(filter)}&subjectFilter=${encodeURIComponent(subjectFilter)}`;
  let response = await fetch(
    url,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) 
  {
    return { ok: false, status: response.status, statusText: response.statusText };
  }

  const data = await response.json();
  
  console.log(data);

  return { ok: true, data };

}

async function call_get_subjects_api() 
{
    try {
        let response = await fetch(`https://localhost:7052/api/Subject`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText };
        return { ok: true, data: await response.json() };
    } 
    catch (error) {
        console.error("Update exam error:", error);
        return { ok: false, status: 0, statusText: error.message };
    }
}

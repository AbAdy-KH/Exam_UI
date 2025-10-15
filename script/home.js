import {exams} from '../data/exams.js';
import {get_subject} from '../data/subjects.js';
import {get_user} from '../data/users.js';

intitialize_elements();
render_exams_table(exams);



function intitialize_elements()
{
  let searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', () => {
    filterTable();
  });

  let subjectFilter = document.getElementById('subjectFilter');

  subjectFilter.addEventListener('change', () => {
    filterTable();
  });
}

function filterTable()
{
  let searchInputVal = document.getElementById('searchInput').value.toLowerCase();
  let subjectFilterVal = document.getElementById('subjectFilter').value.toLowerCase();


  let filterdData = [...exams];
  filterdData = exams.filter(exam => {

    const matchesSearch = exam.title.toLowerCase().includes(searchInputVal) ||
    get_subject(exam.subjectId).name.toLowerCase().includes(searchInputVal) ||
    get_user(exam.userId).username.toLowerCase().includes(searchInputVal);

    const matchesSubject = subjectFilterVal === 'all' ||
    get_subject(exam.subjectId).name.toLowerCase() === subjectFilterVal;

    console.log(matchesSubject);
    console.log(matchesSearch);

    return matchesSubject && matchesSearch;
  });

  render_exams_table(filterdData);
}

function render_exams_table(table)
{
  let html = ``;

  if (table.length === 0) {
    document.getElementById('tableBody').innerHTML = '<tr><td colspan="4" class="no-results">No exams found</td></tr>';
    return;
  }

  table.forEach(exam => {

    let subjectObj = get_subject(exam.subjectId);
    let userObj = get_user(exam.userId);

    html += `
      <tr>
          <td data-label="ID"><span class="id-badge">#${exam.id}</span></td>
          <td data-label="Subject"><span class="subject-tag subject-programming">${subjectObj.name}</span></td>
          <td data-label="Title">${exam.title}</td>
          <td data-label="User"><span class="user-name">${userObj.username}</span></td>
      </tr>
    `;
    document.getElementById('tableBody').innerHTML = html;


  });
}
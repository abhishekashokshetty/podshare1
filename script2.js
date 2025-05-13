let editingIndex = null;

document.getElementById('podcastForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const podcast = {
    title: document.getElementById('title').value,
    website: document.getElementById('website').value,
    stream: document.getElementById('stream').value,
    review: document.getElementById('review').value,
    date: document.getElementById('date').value
  };

  let archive = JSON.parse(localStorage.getItem('podcastArchive')) || [];

  if (editingIndex !== null) {
    archive[editingIndex] = podcast;
    editingIndex = null;
  } else {
    archive.push(podcast);
  }

  localStorage.setItem('podcastArchive', JSON.stringify(archive));
  this.reset();
  displayPodcasts();
});

document.getElementById('searchInput').addEventListener('input', displayPodcasts);

function displayPodcasts() {
  const archive = JSON.parse(localStorage.getItem('podcastArchive')) || [];
  const search = document.getElementById('searchInput').value.toLowerCase();
  const list = document.getElementById('podcastList');
  list.innerHTML = '';

  archive
    .filter(p => p.title.toLowerCase().includes(search))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((podcast, index) => {
      const div = document.createElement('div');
      div.className = 'podcast-card';
      div.innerHTML = `
        <h3>${podcast.title} (${podcast.date})</h3>
        <p>${podcast.review}</p>
        <p>
          <a href="${podcast.website}" target="_blank">Visit Website</a> |
          <a href="${podcast.stream}" target="_blank">Listen Now</a>
        </p>
        <button class="small" onclick="editPodcast(${index})">✏️ Edit</button>
        <button class="small" onclick="deletePodcast(${index})">🗑️ Delete</button>
      `;
      list.appendChild(div);
    });
}

function editPodcast(index) {
  const archive = JSON.parse(localStorage.getItem('podcastArchive'));
  const podcast = archive[index];
  document.getElementById('title').value = podcast.title;
  document.getElementById('website').value = podcast.website;
  document.getElementById('stream').value = podcast.stream;
  document.getElementById('review').value = podcast.review;
  document.getElementById('date').value = podcast.date;
  editingIndex = index;
}

function deletePodcast(index) {
  if (!confirm("Are you sure you want to delete this entry?")) return;
  let archive = JSON.parse(localStorage.getItem('podcastArchive'));
  archive.splice(index, 1);
  localStorage.setItem('podcastArchive', JSON.stringify(archive));
  displayPodcasts();
}

function exportToCSV() {
  const archive = JSON.parse(localStorage.getItem('podcastArchive')) || [];
  const csvContent = "data:text/csv;charset=utf-8,"
    + ["Title,Website,Stream Link,Review,Date"]
      .concat(archive.map(p => 
        `"${p.title}","${p.website}","${p.stream}","${p.review}","${p.date}"`))
      .join("\n");

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', 'podcast_archive.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

displayPodcasts();

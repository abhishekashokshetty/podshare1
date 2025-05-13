document.getElementById('podcastForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const website = document.getElementById('website').value;
  const stream = document.getElementById('stream').value;
  const review = document.getElementById('review').value;
  const date = document.getElementById('date').value;

  const podcast = { title, website, stream, review, date };

  let archive = JSON.parse(localStorage.getItem('podcastArchive')) || [];
  archive.push(podcast);
  localStorage.setItem('podcastArchive', JSON.stringify(archive));

  this.reset();
  displayPodcasts();
});

function displayPodcasts() {
  const archive = JSON.parse(localStorage.getItem('podcastArchive')) || [];
  const list = document.getElementById('podcastList');
  list.innerHTML = '';

  archive.sort((a, b) => new Date(b.date) - new Date(a.date));

  archive.forEach(podcast => {
    const div = document.createElement('div');
    div.className = 'podcast-card';
    div.innerHTML = `
      <h3>${podcast.title} (${podcast.date})</h3>
      <p>${podcast.review}</p>
      <p>
        <a href="${podcast.website}" target="_blank">Visit Website</a> |
        <a href="${podcast.stream}" target="_blank">Listen Now</a>
      </p>
    `;
    list.appendChild(div);
  });
}

// Initial render
displayPodcasts();

document.addEventListener('DOMContentLoaded', function() {
  searchMovie();
});

function searchMovie() {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhODM0OTc1MzMxNjNlNzE3ZDU0YjM1NjIzYTJhMWM3YyIsInN1YiI6IjY1OTNiYmZhY2U0ZGRjNmQzODdlZWE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0JWDAgp6GlPFD0IpzFiVfmAR3y3vH1s6Um7dQ8lwXUU'
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const movieList = document.getElementById('movieList');
      movieList.innerHTML = '';
      let moviesData = data['results'];
      moviesData.forEach(movie => {
        let id = movie['id'];
        let poster_path = movie['poster_path'];
        let title = movie['title'];
        let overview = movie['overview'];
        let vote_average = movie['vote_average'];

        let temp_html = `
        <div class="movieselect" id="${id}">
          <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="">
          <h3>${title}</h3>
          <p>${overview}</p>
          <h5>average: ${vote_average}</h5>
        </div>
        `;
        movieList.insertAdjacentHTML('beforeend', temp_html);
      });

      setupSearch(); // 검색 데이터 수집과 이벤트 리스너 설정
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const movieSelectElements = document.querySelectorAll('.movieselect');
  
  
  let searchData = Array.from(movieSelectElements).map(movieCard => {
    return {
      title: movieCard.querySelector('h3').innerText.toUpperCase(),
      card: movieCard
    };
  });

  const searchBtn = document.getElementById('searchBtn');
  const movieList = document.getElementById('movieList');

  searchBtn.addEventListener('click', function() {
    const searchText = searchInput.value.toUpperCase();
    const filteredResults = searchData.filter(item =>
      item.title.includes(searchText)
    );

    displayResults(filteredResults.map(item => item.card)); // 검색 결과 표시
  });
  
  movieSelectElements.forEach(movieCard => {
    movieCard.addEventListener('click', function() {
      const movieId = movieCard.id;
      if (movieId) {
        alert(`id: ${movieId}`);
      }
    });
  });
}

document.addEventListener('click', function(event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains('movieselect')) {
    const movieId = clickedElement.id;
    if (movieId) {
      alert(`ID: ${movieId}`);
    }
  }
});

function displayResults(results) {
  const movieList = document.getElementById('movieList');

  if (results.length > 0) {
    movieList.innerHTML = ''; 
    results.forEach(movieCard => {
      movieList.appendChild(movieCard.cloneNode(true)); 
    });
  } else {
    movieList.innerHTML = '<p>검색 결과가 없습니다.</p>';
  }
}


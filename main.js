// DOMContentLoaded 이벤트가 발생하면 searchMovie 함수 실행
document.addEventListener('DOMContentLoaded', function() {
  searchMovie();
});

// 영화 검색 API를 호출하여 영화 목록을 가져오는 함수
function searchMovie() {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
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
      movieList.innerHTML = data.results.map(movie => {
        let { id, poster_path, title, overview, vote_average } = movie;
        return `
          <div class="movieselect" id="${id}">
            <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="">
            <h3>${title}</h3>
            <p>${overview}</p>
            <h5>average: ${vote_average}</h5>
          </div>
        `;
      }).join('');

      setupSearch(); // 검색 데이터 수집과 이벤트 리스너 설정
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// 영화 검색과 검색 결과를 표시하는 함수 설정
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const movieSelectElements = document.querySelectorAll('.movieselect');
  
  // 검색 버튼 클릭 시 검색 기능 실행
  const searchBtn = document.getElementById('searchBtn');
  searchBtn.addEventListener('click', function() {
    const searchText = searchInput.value.toUpperCase();
    const searchData = Array.from(movieSelectElements).map(movieCard => {
      return {
        title: movieCard.querySelector('h3').innerText.toUpperCase(),
        card: movieCard
      };
    });

    const filteredResults = searchData.filter(item =>
      item.title.includes(searchText)
    );

    displayResults(filteredResults.map(item => item.card)); // 검색 결과 표시
  });
  
  // 각 영화 카드를 클릭했을 때 ID를 알려주는 alert 이벤트 설정
  movieSelectElements.forEach(movieCard => {
    movieCard.addEventListener('click', function() {
      const movieId = movieCard.id;
      if (movieId) {
        alert(`ID: ${movieId}`);
      }
    });
  });
}

// 검색 결과를 화면에 표시하는 함수
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

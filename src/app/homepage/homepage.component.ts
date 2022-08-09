import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../environments/environment'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  listOfMovies: any = [];
  title: string = "";
  year: string = "";
  imbdid: string = "";
  favs: any[] = [];
  favIds: any[] = [];

  constructor(private snackBar: MatSnackBar, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Process input forms and place requests based on them
   * 
   * @param {string} filter 
   * @param {string} str_query 
   */
  onChange(filter: string, str_query: string): void {
    let search_flag = false;
    this.listOfMovies = [];
    str_query = str_query.replace(/\s+/g, '+').toLowerCase();
    switch (filter) {
      case 'title':
        this.title = str_query;
        search_flag = true;
        break;
      case 'year':
        this.year = str_query;
        search_flag = true;
        break;
      case 'imbdid':
        this.title = "";
        this.year = "";
        this.imbdid = str_query;
        this.http.get<any>('http://www.omdbapi.com/?apikey=' + env.apiKey + '&i=' + this.imbdid).subscribe((data: any) => {
          if (data.Response != "False")
            this.listOfMovies.push(data);
        })
        break;
    }

    if (search_flag)
      this.http.get<any>('http://www.omdbapi.com/?apikey=' + env.apiKey + '&s=' + this.title + "&y=" + this.year).subscribe((data: any) => {
        if (data.Search)
          for (let movie of data.Search) {
            this.listOfMovies.push(movie);
          }
      })
  }

  /**
   * Redirect window to movie IMBD page 
   * 
   * @param {string} id IMBD movie id 
   */
  goToIMBD(id: string): void {
    window.location.href = "https://www.imdb.com/title/" + id;
  }

  /**
   * Deal with poster source and retrieve a placeholder in case of N/A
   * 
   * @param {string} source 
   * @returns {string} valid source
   */
  processPoster(source: string): string {
    return source == 'N/A' ? '../../assets/placeholder.png' : source;
  }

  /**
   * Go to selected movie view
   * 
   * @param movie 
   */
  focusMovie(movie: any): void {
    this.router.navigate(['/movie', movie.imdbID]);
  }

  /**
  * Go to selected movie view via imdbID
  * 
  * @param movieId 
  */
  focusMovieById(movieId: any): void {
    this.router.navigate(['/movie', movieId]);
  }

  /**
   * 
   * @param movie 
   */
  addToBookmarks(movie: any): void {
    if (!this.isFav(movie)) {
      localStorage.setItem(movie.imdbID, movie.Title);
    }

    this.snackBar.open("Added to favorites.", "Ok", {
      duration: 4000,
    });
  }

  /**
 * 
 * @param movie 
 */
  removeFromBookmarks(movie: any): void {
    try {
      // In case we want to remove a movie using its id
      if (typeof movie === 'string')
        localStorage.removeItem(movie)
      // Otherwise, removing it using its object instance
      else
        localStorage.removeItem(movie.imdbID);
      this.snackBar.open("Removed from favorites.", "Ok", {
        duration: 4000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    } catch (error) {
      this.snackBar.open("Couldn't remove movie from favorites.", "Ok", {
        duration: 4000,
      });
    }
  }

  /**
   * Check if a movie is already bookmarked
   * 
   * @param movie 
   * @returns {boolean} true if movie is bookmarked and false otherwise
   */
  isFav(movie: any): boolean {
    return localStorage.getItem(movie.imdbID) != null ? true : false;
  }

  /**
   * Update favorites data structures
   */
  getFavorites(): any {
    for (let i = 0; i <= localStorage.length; i++) {
      if (localStorage.key(i) != null && !this.favs.includes(localStorage.getItem(localStorage.key(i)!))) {
        this.favIds.push(localStorage.key(i));
        this.favs.push(localStorage.getItem(localStorage.key(i)!));
      }
    }
  }
}

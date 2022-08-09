import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment'
import { query } from '@angular/animations';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  // Current movie instance
  movie: any = {};
  params: any = {};

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Get imdb id from current url
    const queryString = window.location.href;
    const url = new URL(queryString);
    const imdbID = url.pathname.replace("/movie/", "");


    this.http.get<any>('http://www.omdbapi.com/?apikey=' + env.apiKey + '&i=' + imdbID).subscribe((data: any) => {
      this.movie = data;
      this.params = Object.keys(this.movie)
    })
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}

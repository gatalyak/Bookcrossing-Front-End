import {Component, OnDestroy, OnInit} from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import {IUser} from '../../../core/models/user';
import {BookQueryParams} from "../../../core/models/bookQueryParams";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SearchBarService} from "../../../core/services/searchBar/searchBar.service";


@Component({
  selector: 'app-registered-book',
  templateUrl: './registered-book.component.html',
  styleUrls: ['./registered-book.component.scss']
})

export class RegisteredBookComponent implements OnInit, OnDestroy {

  books: IBook[];
  user: IUser;
  totalSize: number;
  queryParams: BookQueryParams = new BookQueryParams;

  selectedGenres: number[];


  constructor(private routeActive: ActivatedRoute,
              private router: Router,
              private bookService: BookService,
              private searchBarService: SearchBarService,
  ) { }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 5)
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
  }
  onFilterChange(filterChanged: boolean) {
    this.queryParams.genres = this.selectedGenres
    if (filterChanged) {
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = true;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      }
      else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
  }

  //Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private resetPageIndex(): void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams,
      });
  }


  //get
  getBooks(params: BookQueryParams): void {
    this.bookService.getRegisteredBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }
  makeRequest(bookId: number): void {
    alert(bookId);
  }

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
}

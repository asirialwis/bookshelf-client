import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports:[CommonModule, HttpClientModule]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get<Book[]>('http://localhost:5232/api/book').subscribe({
      next: (data) => {
        this.books = data;
        console.log('Books fetched successfully:', data);
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      },
      complete: () => {
        console.log('Book fetching completed');
      }
    });
  }
  

  viewBook(id: number): void {
    alert(`View Book with ID: ${id}`);
  }

  editBook(id: number): void {
    alert(`Edit Book with ID: ${id}`);
  }

  deleteBook(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this book?');
    if (confirmed) {
      this.http.delete(`http://localhost:5232/api/book/${id}`).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
          console.log(`Book with ID ${id} deleted successfully.`);
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        },
        complete: () => {
          console.log('Delete book operation completed.');
        }
      });
    }
  }
  
}

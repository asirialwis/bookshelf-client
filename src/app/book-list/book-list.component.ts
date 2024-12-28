import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule, HttpClientModule,FormsModule]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  editingBook: Book | null = null;
  showAddBookModal = false; // Controls visibility of the Add Book modal

  newBook = {
    title: '',
    author: '',
    isbn: '',
    publicationDate: ''
  };

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

  addBook(): void {
    this.http.post<Book>('http://localhost:5232/api/book', this.newBook).subscribe({
      next: (createdBook) => {
        this.books.push(createdBook); // Add new book to the list
        console.log('Book added successfully:', createdBook);
        this.closeAddBookModal(); // Close the modal after success
      },
      error: (error) => {
        console.error('Error adding book:', error);
      }
    });
  }

  openAddBookModal(): void {
    this.showAddBookModal = true;
  }

  closeAddBookModal(): void {
    this.showAddBookModal = false;
    this.resetNewBook();
  }

  resetNewBook(): void {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      publicationDate: ''
    };
  }

  viewBook(id: number): void {
    alert(`View Book with ID: ${id}`);
  }

  editBook(book: Book): void {
    this.editingBook = { ...book }; // Create a copy for editing
  }

  saveBook(): void {
    if (this.editingBook) {
      this.http.put<Book>(`http://localhost:5232/api/book/${this.editingBook.id}`, this.editingBook).subscribe({
        next: (updatedBook) => {
          const index = this.books.findIndex(book => book.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          console.log(`Book with ID ${updatedBook.id} updated successfully.`);
          this.editingBook = null; // Clear editing state
        },
        error: (error) => {
          console.error('Error updating book:', error);
        },
        complete: () => {
          console.log('Book update operation completed.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingBook = null; // Clear editing state
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

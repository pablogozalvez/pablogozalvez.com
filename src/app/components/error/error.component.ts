import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterModule, HighlightDirective],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  errorCode: string = '404';
  errorMessage: string =
    'The page you are looking for does not exist. Please, check the URL and try again.';
  errorCodeContent: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Extract error code from route parameters
    this.route.paramMap.subscribe((params) => {
      const code = params.get('code');
      if (code) {
        this.errorCode = code;
        this.setErrorMessage(code);
      }
      this.updateErrorCodeContent();
    });
  }

  private setErrorMessage(code: string): void {
    switch (code) {
      case '404':
        this.errorMessage =
          'The page you are looking for does not exist. Please, check the URL and try again.';
        break;
      case '500':
        this.errorMessage = 'Server error. Please try again later.';
        break;
      case '403':
        this.errorMessage =
          'Access denied. You do not have permission to access this resource.';
        break;
      default:
        this.errorMessage = 'An error occurred. Please try again later.';
    }
  }

  private updateErrorCodeContent(): void {
    this.errorCodeContent = `    public class Error${this.errorCode} {
        public static void main(String[] args) {
            System.err.println("${this.errorMessage}");
            System.err.println("Please, check the URL and try again.");
        }
    }`;
  }
}

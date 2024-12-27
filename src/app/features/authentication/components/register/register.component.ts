import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })

  }

  OnRegister() {
    if (!this.loginForm.valid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.register({ username, password }).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.snackBar.open('Registration successful. Please login', 'Close', {
            duration: 4000,
          });
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.snackBar.open(err.error.errorMessage ?? '', 'Close', {
          duration: 4000,
        });
      }
    });
  }
}

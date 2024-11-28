import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DesignationService } from '../../services/designation.service';
import { DesignationAddUpdateMapper } from '../../designation.mapper';

@Component({
  selector: 'app-designation-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    NgIf],
  templateUrl: './designation-form.component.html',
  styleUrl: './designation-form.component.css'
})
export class DesignationFormComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() designationData: any = null;
  @Output() formCloseEvent = new EventEmitter<void>();
  @Output() successfulAddUpdateDesignationEvent = new EventEmitter<void>();

  designationForm!: FormGroup;

  constructor(private designationService: DesignationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.mode === 'edit' && this.designationData) {
      this.populateForm();
    }
  }

  onClose() {
    this.designationForm.reset();
    this.formCloseEvent.emit();
  }

  initializeForm(): void {
    this.designationForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required])
    });
  }

  populateForm(): void {
    this.designationForm.patchValue({
      id: this.designationData.id,
      name: this.designationData.name
    });

    this.designationForm.get('id')?.disable();
  }

  onSubmit() {
    if (this.designationForm.valid) {
      if (this.mode === 'edit') {
        let designationUpdate = DesignationAddUpdateMapper(this.designationForm.value);
        this.designationService.updateDesignation(this.designationForm.get('id')?.value, designationUpdate).subscribe({
          next: () => {
            this.snackBar.open('Designation updated successfully', 'Close', { duration: 2000 });
            this.successfulAddUpdateDesignationEvent.emit();
          },
          error: (err) => {
            console.error('Error updating designation', err);
            this.snackBar.open('Failed to update designation', 'Close', { duration: 2000 });
          }
        });
      }
      else {
        let designationAddDto = DesignationAddUpdateMapper(this.designationForm.value);
        this.designationService.addDesignation(designationAddDto).subscribe({
          next: () => {
            this.snackBar.open('Designation added successfully', 'Close', { duration: 2000 });
            this.successfulAddUpdateDesignationEvent.emit();
          },
          error: (err) => {
            console.error('Error adding designation', err);
            this.snackBar.open('Failed to add designation', 'Close', { duration: 2000 });
          }
        });
      }
      console.log('Form submitted:', this.designationForm.value);
    }
  }
}

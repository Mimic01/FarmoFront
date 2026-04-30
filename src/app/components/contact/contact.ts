import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: '',
  };

  submitted = false;

  onSubmit(): void {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.submitted = true;
    }
  }

  resetForm(): void {
    this.formData = { name: '', email: '', message: '' };
    this.submitted = false;
  }
}

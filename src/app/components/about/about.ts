import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  stats = [
    { value: '15+', label: 'Años de experiencia' },
    { value: '500+', label: 'Clientes satisfechos' },
    { value: '50+', label: 'Productos premium' },
    { value: '98%', label: 'Índice de satisfacción' },
  ];
}

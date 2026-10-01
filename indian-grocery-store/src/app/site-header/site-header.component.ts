import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'store-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
})
export class SiteHeaderComponent {}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent {
  constructor(
    private router: Router,
    private _localStorageService: LocalStorageService
  ) {}

  onHomeClick() {
    this.router.navigateByUrl('');
  }

  onLogOut() {
    this._localStorageService.clear('authToken');
    this._localStorageService.clear('userId');
    this.router.navigateByUrl('/auth');
  }
}

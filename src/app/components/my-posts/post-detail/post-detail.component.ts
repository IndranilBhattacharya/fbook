import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  @Input('postData') postData!: Post;

  constructor() {}

  ngOnInit(): void {}
}

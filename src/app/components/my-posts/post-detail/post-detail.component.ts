import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from '../../../interfaces/post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  isAlive: boolean = true;
  @Input('postData') postData!: Post;
  postText: FormControl = new FormControl('');

  constructor() {}

  ngOnInit(): void {
    //console.log(this.postData);
    this.postText.setValue(this.postData?.post || '');
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}

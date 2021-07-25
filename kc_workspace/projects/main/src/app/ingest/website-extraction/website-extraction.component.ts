import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-website-extraction',
  templateUrl: './website-extraction.component.html',
  styleUrls: ['./website-extraction.component.scss']
})
export class WebsiteExtractionComponent implements OnInit {
  options: FormGroup;
  rename = new FormControl(false);
  summarize = new FormControl(true);
  visualizations = new FormControl(true);
  extractMetadata = new FormControl(true);
  preserveSourceContent = new FormControl(false);
  categorize = new FormControl();
  rename_to = new FormControl();
  url = new FormControl();

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      rename: this.rename,
      rename_to: this.rename_to,
      summarize: this.summarize,
      visualizations: this.visualizations,
      extractMetadata: this.extractMetadata,
      categorize: this.categorize,
      preserveSourceContent: this.preserveSourceContent,
      url: this.url
    });

    this.url.setValue('www.google.com');
  }

  ngOnInit(): void {
  }

}

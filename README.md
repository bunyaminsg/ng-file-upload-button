# ng-file-upload-button
File uploader for Angular2+

Installation:

    npm install ng-file-upload-button

Example usage:

**app.module.ts**

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { FileUploadButtonComponent } from 'file-upload-button';


@NgModule({
  declarations: [
    AppComponent,
    FileUploadButtonComponent // Declare the component in your module
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**app.component.ts**

```
import {Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readyState: string;
  content: string;
  error: string;
  progress: number;
  abort: EventEmitter<void> = new EventEmitter<void>();
}
```

**app.component.html**

```
<file-upload-button
  (readyState)="readyState = $event"
  (contentLoaded)="content = $event"
  (progressPercentage)="progress = $event"
  (error)="error = $event"
  [abort]="abort"
  [maxFileSize]="26214400"
  btnClass="myButton"
  [btnStyle]="{'font-weight': 'bold', 'text-decoration': 'underline'}">
  Upload <!-- Button label here -->
</file-upload-button>

<button class="myButton" (click)="abort.emit()">Cancel</button>

<p><b>Ready State:</b> {{readyState}}</p>
<p><b>Progress:</b> {{progress}}%</p>
<p><b>Error:</b></p><pre>{{error?.message}}</pre>
<p *ngIf="content">Loaded!</p>
```

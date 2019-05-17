import {AfterViewInit, Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';


export const FUB_CUSTOM_ERRORS = {
  FILE_SIZE_LIMIT_EXCEEDED: 'File Size Limit Exceeded'
};

@Component({
  selector: 'file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.css']
})
export class FileUploadButtonComponent implements OnInit, AfterViewInit {

  private reader  = new FileReader();
  @Input() btnClass: any;
  @Input() btnStyle: {[key: string]: string};
  @Input() abort: EventEmitter<void> = new EventEmitter<void>();
  @Input() maxFileSize: number;

  @Output() contentLoaded: EventEmitter<string> = new EventEmitter<string>();
  @Output() progressPercentage: EventEmitter<number> = new EventEmitter<number>();
  @Output() aborted: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() error: EventEmitter<ErrorEvent> = new EventEmitter<ErrorEvent>();
  @Output() readyState: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.reader.addEventListener('error', (e) => {
      this.error.emit(e);
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('abort', (e) => {
      this.aborted.emit(e);
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('load', () => {
      this.contentLoaded.emit(this.reader.result);
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('progress', (e) => {
      this.progressPercentage.emit(Math.round((e.loaded / e.total) * 100));
      console.log(Math.round((e.loaded / e.total) * 100));
    }, false);

    this.readyState.emit(this.reader.readyState);
  }

  ngAfterViewInit() {
    if (this.abort) {
      this.abort.subscribe(() => {
        this.abortUpload();
      });
    }
  }

  uploadFile() {
    this.clearAll();
    this.readyState.emit(this.reader.readyState);
    const file = (<HTMLInputElement>document.getElementById('f-in')).files[0];
    if (file) {
      if (this.maxFileSize && (file.size > this.maxFileSize)) {
        this.error.emit(new ErrorEvent(FUB_CUSTOM_ERRORS.FILE_SIZE_LIMIT_EXCEEDED, {
          error : new Error(FUB_CUSTOM_ERRORS.FILE_SIZE_LIMIT_EXCEEDED),
          message : `File is too big: ${file.size} bytes (limit: ${this.maxFileSize})`,
          filename : file.name
        }));
      } else {
        this.reader.readAsDataURL(file);
        this.readyState.emit(this.reader.readyState);
      }
    }
  }

  abortUpload() {
    this.reader.abort();
    this.clearAll();
    this.readyState.emit(this.reader.readyState);
  }

  private clearAll() {
    this.contentLoaded.emit(undefined);
    this.progressPercentage.emit(0);
    this.error.emit(undefined);
  }
}

@NgModule({
  declarations: [
    FileUploadButtonComponent
  ],
  providers: [],
  exports: [
    FileUploadButtonComponent
  ]
})
export class FileUploadButtonModule { }


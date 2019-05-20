import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export const FUB_CUSTOM_ERRORS = {
  FILE_SIZE_LIMIT_EXCEEDED: 'File Size Limit Exceeded'
};

export interface UploadedFile extends File {
  content: string;
}

@Component({
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.css']
})
export class FileUploadButtonComponent implements OnInit, AfterViewInit {

  private reader  = new FileReader();
  @Input() btnClass: any;
  @Input() btnStyle: {[key: string]: string};
  @Input() abort: EventEmitter<void> = new EventEmitter<void>();
  @Input() maxFileSize: number;

  @Output() readStart: EventEmitter<void> = new EventEmitter<void>();
  @Output() contentLoaded: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();
  @Output() progressPercentage: EventEmitter<number> = new EventEmitter<number>();
  @Output() aborted: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() error: EventEmitter<ErrorEvent> = new EventEmitter<ErrorEvent>();
  @Output() readyState: EventEmitter<number> = new EventEmitter<number>();
  private file: File;

  constructor() { }

  ngOnInit() {
    this.reader.addEventListener('error', (e) => {
      this.error.emit(e);
      (<HTMLInputElement>document.getElementById('f-in')).value = '';
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('abort', (e) => {
      this.aborted.emit(e);
      (<HTMLInputElement>document.getElementById('f-in')).value = '';
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('load', () => {
      const result: UploadedFile = {
        content: this.reader.result,
        size: this.file.size,
        name: this.file.name,
        lastModifiedDate: this.file.lastModifiedDate,
        type: this.file.type,
        webkitRelativePath: this.file.webkitRelativePath,
        msClose: this.file.msClose,
        msDetachStream: this.file.msDetachStream,
        slice: this.file.slice
      };
      this.contentLoaded.emit(result);
      (<HTMLInputElement>document.getElementById('f-in')).value = '';
      this.readyState.emit(this.reader.readyState);
    }, false);

    this.reader.addEventListener('progress', (e) => {
      this.progressPercentage.emit(Math.round((e.loaded / e.total) * 100));
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
    const files = (<HTMLInputElement>document.getElementById('f-in')).files;
    if (!files || !files.length) { return; }
    this.readyState.emit(this.reader.readyState);
    this.file = files[0];
    if (this.file) {
      if (this.maxFileSize && (this.file.size > this.maxFileSize)) {
        this.error.emit(new ErrorEvent(FUB_CUSTOM_ERRORS.FILE_SIZE_LIMIT_EXCEEDED, {
          error : new Error(FUB_CUSTOM_ERRORS.FILE_SIZE_LIMIT_EXCEEDED),
          message : `File is too big: ${this.file.size} bytes (limit: ${this.maxFileSize})`,
          filename : this.file.name
        }));
      } else {
        this.reader.readAsDataURL(this.file);
        this.readStart.emit();
        this.readyState.emit(this.reader.readyState);
      }
    }
  }

  abortUpload() {
    this.reader.abort();
    this.readyState.emit(this.reader.readyState);
  }

}


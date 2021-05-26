import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  public selectedFile: FileList = null;
  public className = 'file-upload-container';
  private _minDuration = 0; // 0 hours into second
  private _maxDuration = 14400;  // 4 hours into second
  private _maxFileSize = 2147483648; // 4 gb into byte
  public _isDisabled = false;
  private _dragOverFn: () => void;
  private _dragLeaveFn: () => void;
  private _dropFn: () => void;

  @Input() isAllowDragDrop = true;
  @Input() allowFileTypes = ['.flac', '.mp3', '.mp4', '.m4a', '.wav'];
  @Input() isAllowMultiple = true;



  @Input()
  set isDisabled(v: boolean) {
    this._isDisabled = v;
    // this.addDragDrop();
  }

  @Input()
  set maxFileSize(v: number) {
    this._maxFileSize = v;
  }

  @Input()
  set minDuration(v: number) {
    this._minDuration = v;
  }
  @Input()
  set maxDuration(v: number) {
    this._maxDuration = v;
  }

  @Input()
  public set classes(name: string) {
    this.className += ` ${name}`;
  }

  @Output() selectFiles = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFileInput = new EventEmitter<any>();



  @ViewChild('form', { static: false }) form: ElementRef;
  @ViewChild('dragdrop', { static: false }) dragdrop: ElementRef;

  public allowFileText = null;

  constructor(
    private renderer2: Renderer2,
  ) {
    this.allowFileText = this.allowFileTypes.map((item) => item.replace('.', ''));
    // this.allowFileText = this.allowFileText.slice(0, -1).join(', ').toUpperCase() + ', or ' + this.allowFileText.slice(-1).toUpperCase();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.addDragDrop();
  }

  onInput($event) {
    this.onFileInput.emit((new Date()));
  }

  addDragDrop() {
    if (this.isAllowDragDrop) {
      this._dragOverFn = this.renderer2.listen(this.dragdrop.nativeElement, 'dragover', (event) => {
        this.renderer2.addClass(this.dragdrop.nativeElement, 'upload-focus');
        event.preventDefault();
        event.stopPropagation();
      });
      this._dragLeaveFn = this.renderer2.listen(this.dragdrop.nativeElement, 'dragleave', (event) => {
        this.renderer2.removeClass(this.dragdrop.nativeElement, 'upload-focus');
        event.preventDefault();
        event.stopPropagation();
      });
      this._dropFn = this.renderer2.listen(this.dragdrop.nativeElement, 'drop', (event) => {
        this.renderer2.removeClass(this.dragdrop.nativeElement, 'upload-focus');
        event.preventDefault();
        event.stopPropagation();
        if (this._isDisabled) {
          this.selectFiles.emit(false);
          this.form.nativeElement.reset();
        } else {
          const files = event.dataTransfer.files;
          if (files.length > 0) {
            this.onFileInput.emit((new Date()));
            this.onFileSelected(files);
          }
        }

      });
    } else {
      if (this._dragOverFn) {
        this._dragOverFn();
      }
      if (this._dragLeaveFn) {
        this._dragLeaveFn();
      }
      if (this._dropFn) {
        this._dropFn();
      }
    }
  }

  public onFileSelected(event: FileList) {
    if (this._isDisabled) {
      this.selectFiles.emit(false);
    } else {
      this.selectedFile = event;
      const files = [];
      for (let i = 0; i < this.selectedFile.length; i++) {
        this.selectedFile.item(i)['id'] = i + 1;
        this.selectedFile.item(i)['isValidFileName'] = environment.fileNameValidation.test(this.selectedFile.item(i).name);
        this.selectedFile.item(i)['isValidFileType'] = this.hasExtension(this.selectedFile.item(i).name);
        this.selectedFile.item(i)['isValidSize'] = this.selectedFile.item(i).size <= this._maxFileSize; // in bytes
        files.push(this.getDuration(this.selectedFile.item(i)));
      }
      Promise.all(files).then((resolve) => {
        for (let i = 0; i < resolve.length; i++) {
          if (this.selectedFile.item(i)['id'] === resolve[i]['id'] && resolve[i]['duration']) {
            this.selectedFile.item(i)['duration'] = resolve[i]['duration']; // in seconds
            this.selectedFile.item(i)['isValidDuration'] = resolve[i]['duration'] >= this._minDuration && resolve[i]['duration'] <= this._maxDuration; // in seconds
          }
          this.selectedFile.item(i)['isAudio'] = resolve[i]['isAudio']; // in seconds
          this.selectedFile.item(i)['isValidFile'] = resolve[i]['isValidFile']; // in seconds
          this.selectedFile.item(i)['completed'] = null;
        }

        const updatedFiles = [];
        for (let i = 0; i < this.selectedFile.length; i++) {
          updatedFiles.push({
            ...this.selectedFile.item(i),
            name: this.selectedFile.item(i).name,
            size: this.selectedFile.item(i).size,
            type: this.selectedFile.item(i).type,
            lastModified: this.selectedFile.item(i).lastModified,
            lastModifiedDate: this.selectedFile.item(i)['lastModifiedDate'],
            file: this.selectedFile.item(i)
          });
        }
        // if (this.isAllowMultiple) {
        this.selectFiles.emit(updatedFiles);
        // } else {
        //   this.selectFiles.emit([updatedFiles[0]]);
        // }
        this.form.nativeElement.reset();
      }, (reject) => {
        // console.log(reject);
      });
    }

  }

  public getDuration(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const objecturl = URL.createObjectURL(file);
      const audio = new Audio(objecturl);
      if (audio.canPlayType(file.type) === '') {
        file.isAudio = false;
        resolve(file);
      } else {
        audio.addEventListener(
          'canplaythrough',
          () => {
            URL.revokeObjectURL(objecturl);
            file.isAudio = true;
            file.isValidFile = true;
            file.duration = audio.duration;
            resolve(file);
          },
          false,
        );
        audio.addEventListener(
          'error',
          (e) => {
            file.isAudio = true;
            file.isValidFile = false;
            resolve(file);
          },
          false,
        );
      }
    });
  }

  public hasExtension(fileName) {
    return (new RegExp('(' + this.allowFileTypes.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }

}

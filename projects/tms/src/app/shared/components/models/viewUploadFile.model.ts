import { FileItem } from '../fileUploader/fileItem.class';

export enum enFilePermission {
  noAccess = 0,
  read = 1,
  update = 2,
  delete = 4
}

export enum enUploadStatus {
  none = 0,
  cancel = 1,
  error = 2,
  success = 4
}

export class ViewUploadFileItem {
  public id: number;    // pk of uploaded ID
  public templateId: number;  // template ID
  public name: string;
  public url: string;
  public size: number;
  public lastModified: Date;
  public lastModifiedBy: string;
  public permission: number;

  constructor (id?: number, templateId?: number, name?: string, url?: string, size?: number, lastModified?: Date, lastModifiedBy?: string,
               permission?: number) {
    this.id = id || -1;
    this.templateId = templateId || undefined;
    this.name = name || '';
    this.url = url || '';
    this.size = size || undefined;
    this.lastModified = (lastModified !== undefined) ? new Date(lastModified) : undefined;
    this.lastModifiedBy = lastModifiedBy || '';
    this.permission = permission || enFilePermission.noAccess;
  }

  hasPermission(value: enFilePermission): boolean {
    return (this.permission & value) === value;
  }
}

export class ViewUploadFile {
  public file: ViewUploadFileItem;
  public progress: number;
  public status: enUploadStatus;
  public queueItem: FileItem;

  constructor (id?: number, templateId?: number, name?: string, url?: string, size?: number, lastModified?: Date,
               lastModifiedBy?: string, permission?: enFilePermission, queueItem?: FileItem) {
    this.file = new ViewUploadFileItem(id, templateId, name, url, size, lastModified, lastModifiedBy, permission);
    this.progress = 0;
    this.status = enUploadStatus.none;
    this.queueItem = (queueItem) ? queueItem : undefined;
  }
}

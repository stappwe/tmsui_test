import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  public status: Subject<boolean> = new Subject();
  private _active: boolean = false;
  private _enabled: boolean = true;

  public get active(): boolean {
    return this._active;
  }

  public set active(v: boolean) {
    this._active = v;
    this.status.next(this._active && this._enabled);
  }

  public disable(): void {
    this._enabled = false;
    this.status.next(this._active && this._enabled);
  }

  public enable(): void {
    this._enabled = true;
    this.status.next(this._active && this._enabled);
  }

  public start(): void {
    this.active = true;
  }

  public stop(): void {
    this.active = false;
  }
}

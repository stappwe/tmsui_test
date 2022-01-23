import { Component, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { Subscription } from 'rxjs';

@Component({
  selector: 'label-input',
  templateUrl : './labelInput.component.html',
  styleUrls : ['./labelInput.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelInputComponent implements OnChanges, OnDestroy {
  @Input() labelText: string = '';
  @Input() labelTitle: string;
  @Input() globalClass: string = '';
  @Input() labelClass: string = 'col-sm-2';
  @Input() contentClass: string = 'col-sm-10';
  @Input() required: boolean = false;
  @Input() hideLabel: boolean = false;
  /**
   * Alignment options - None, Top, Center, Bottom
   */
  @Input() labelAlign: string = 'None';

  public addLabelClass: string = '';
  public displayLabel: string = '';

  private mediaSubscription: Subscription;
  private xsDevice: boolean = false;

  constructor(media: MediaObserver) {
    this.mediaSubscription = media.media$.subscribe((change: MediaChange) => {
      if ((change.mqAlias === 'xs') !== this.xsDevice) {
        this.xsDevice = (change.mqAlias === 'xs');
        this.setAddLabelClass(this.labelAlign);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['labelAlign'] !== undefined && changes['labelAlign'].currentValue !== undefined) {
      this.setAddLabelClass(changes['labelAlign'].currentValue);
    }
    if ((changes['labelTitle'] !== undefined && changes['labelTitle'].currentValue !== undefined) ||
      (changes['labelText'] !== undefined && changes['labelText'].currentValue !== undefined)) {
      this.displayLabel = (changes['labelTitle']?.currentValue) ? changes['labelTitle'].currentValue :
        (changes['labelText']?.currentValue) ? changes['labelText'].currentValue : '';
    }
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
  }

  private setAddLabelClass(labelAlign: string): void {
    if (this.xsDevice === false) {
      switch (labelAlign) {
      case 'Top':
        this.addLabelClass = 'label-align-top';
        break;
      case 'Center':
        this.addLabelClass = 'label-align-center';
        break;
      case 'Bottom':
        this.addLabelClass = 'label-align-bottom';
        break;
      default:
        this.addLabelClass = '';
      }
    } else {
      this.addLabelClass = 'label-align-bottom';
    }
  }
}

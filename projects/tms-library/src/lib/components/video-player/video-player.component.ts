import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxAppShellService } from '@eui/core';
import { throwError, fromEvent, Observable, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BaseResizeComponent } from '../class/baseClasses';

declare const shaka: any;

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent extends BaseResizeComponent implements OnInit, OnDestroy {
  @ViewChild('videoDiv', { static: true }) videoDivRef: ElementRef;
  @ViewChild('videoPlayer', { static: true }) videoElementRef: ElementRef;

  public uiHeight: number;
  public uiWidth: number;

  private videoElement: HTMLVideoElement;
  private videoDivElement: HTMLDivElement | undefined;
  private ui: any;
  private controls: any; // shaka.ui.Controls;
  private player: any; // shaka.Player;

  @Input() manifestUri;
  @Input() poster;
  @Input() autoplay;

  @Input() triggeredEvents: string[] = [];
  @Input() currentTime: string;
  @Output() onErrorEvent = new EventEmitter();

  @Output() videoLoaded = new EventEmitter<any>();
  @Output() videoLoadError = new EventEmitter<any>();
  @Output() videoTimeUpdated = new EventEmitter<any>();
  @Output() playerEvents = new EventEmitter<any>();

  constructor(ngzone: NgZone, dialog: MatDialog, uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, uxAppShellService);
  }

  ngOnInit(): void {
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      this.videoElement = this.videoElementRef.nativeElement;
      this.videoDivElement = this.videoDivRef.nativeElement;

      if (this.autoplay != null) {
        this.videoElement.setAttribute('autoplay', '');
      }

      this.initPlayer();
      document.addEventListener('shaka-ui-load-failed', this.initFailed);
    } else {
      // This browser does not have the minimum set of APIs we need.
      throwError('Browser not supported!');
    }
  }
  ngOnDestroy(): void {}

  public windowResize(): void {
    if (window.innerWidth < 768) {
      this.uiWidth = window.innerWidth - 15;
    } else {
      this.uiHeight = window.innerHeight - this.videoDivRef.nativeElement.offsetTop - 15;
      let aspectRation = 16 / 9;
      this.uiWidth = this.uiHeight * aspectRation;
    }
  }

  public loadVideo(dashManifestUrl) {
    this.player
      .load(dashManifestUrl)
      .then(() => {
        this.windowResize();
        this.videoLoaded.emit();
      })
      .catch((e) => {
        this.videoLoadError.emit(e);
      });
  }

  fromEvents(video: HTMLVideoElement, events: string[]): Observable<Event> {
    const eventStreams = events.map((ev) => fromEvent(video, ev));
    return merge(...eventStreams);
  }

  private initPlayer() {
    fromEvent(this.videoElement, 'timeupdate')
      .pipe(
        map((x) => {
          return x.srcElement && Math.trunc(x.srcElement['currentTime']);
        }),
        distinctUntilChanged()
      )
      .subscribe((t) => this.videoTimeUpdated.emit(t));

    const events = [
      ...this.triggeredEvents,
      'pause',
      'play',
      'canplay',
      'playing',
      'waiting',
      'ended',
      'seeked',
      'enterpictureinpicture',
      'leavepictureinpicture',
    ];
    // add events Listener to HTML video element
    this.fromEvents(this.videoElement, events)
      .pipe(distinctUntilChanged())
      .subscribe((evt: Event) => {
        this.playerEvents.emit(evt);
      });

    // Create a Player instance.
    this.player = new shaka.Player(this.videoElement);

    const ui = new shaka.ui.Overlay(
      this.player,
      this.videoDivElement,
      this.videoElement
    );

    this.controls = ui.getControls();

    this.player.addEventListener('error', this.onPlayerErrorEvent);
    this.controls.addEventListener('error', this.onUIErrorEvent);

    // ---------------------------
    // Put UI Customization HERE
    // ---------------------------

    // this.player load and
    this.loadVideo(this.manifestUri);
    if (this.currentTime) {
      this.player.getMediaElement().currentTime = parseInt(this.currentTime, 10);
    }
  }

  private onPlayerErrorEvent(event): void {
    console.log('Unable to play video');
  }

  private onUIErrorEvent(event): void {
    console.log('Unable to play video');
  }

  private initFailed(): void {
    // Handle the failure to load
    console.error('Unable to load the UI library!');
  }
}

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

export interface UIState {
  isUserPreferencesOpen?: boolean;
  isAboutOpen?: boolean;
  isUserSettingsOpen?: boolean;
  isUserProfileOpen?: boolean;
  isFeedbackToolOpen?: boolean;
  isBugFeedbackToolOpen?: boolean;
}

const initialState: UIState = {
  isUserPreferencesOpen: false,
  isAboutOpen: false,
  isUserSettingsOpen: false,
  isUserProfileOpen: false,
  isFeedbackToolOpen: false,
  isBugFeedbackToolOpen: false
};

@Injectable()
export class CoreService {
  private _state$: BehaviorSubject<UIState>;

  constructor() {
    this._state$ = new BehaviorSubject(initialState);
  }

    // -------------------
    // exposed observables
    // -------------------
  get state$(): Observable<UIState> {
    return this._state$.asObservable();
  }

    // ----------------
    // state operations
    // ----------------
  get state(): UIState {
    return this._state$.getValue();
  }

  setState(nextState: UIState) {

    const state = this.state;

    this._state$.next({
      ...nextState,
    });
  }

    // ----------------------------
    // public setters and functions
    // ----------------------------
  set isUserPreferencesOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isUserPreferencesOpen: isOpen,
    });
  }

  public userPreferencesToggle(): void {
    this.isUserPreferencesOpen = !this.state.isUserPreferencesOpen;
  }

  set isAboutOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isAboutOpen: isOpen,
    });
  }

  public aboutToggle(): void {
    this.isAboutOpen = !this.state.isAboutOpen;
  }

  set isUserSettingsOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isUserSettingsOpen: isOpen,
    });
  }

  public userSettingsToggle(): void {
    this.isUserSettingsOpen = !this.state.isUserSettingsOpen;
  }

  set isUserProfileOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isUserProfileOpen: isOpen,
    });
  }

  public userProfileToggle(): void {
    this.isUserProfileOpen = !this.state.isUserProfileOpen;
  }

  set isFeedbackToolOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isFeedbackToolOpen: isOpen,
    });
  }

  public feedbackToolToggle(): void {
    this.isFeedbackToolOpen = !this.state.isFeedbackToolOpen;
  }

  set isBugFeedbackToolOpen(isOpen: boolean) {
    this.setState({
      ...this.state,
      isBugFeedbackToolOpen: isOpen,
    });
  }

  public bugFeedbackToolToggle(): void {
    this.isBugFeedbackToolOpen = !this.state.isBugFeedbackToolOpen;
  }
}

import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // constructor() {}

  /* token backup for reuse token */
  private _tokenSubject = new BehaviorSubject<string | null>(null);
  public tokenSource$ = this._tokenSubject.asObservable();

  /**
   * *Save token to the subject
   *
   * @param {string} token - The token to be saved. Can be a string or null to
   *
   * @developer Abhisek Dhua
   */
  public saveToken(type: string | null) {
    this._tokenSubject.next(type);
  }

  /* title addon for dynamic title */
  private _titleAddonSubject = new Subject<string | null>();
  public pageTitleAddon$ = this._titleAddonSubject.asObservable();

  /**
   * *Setting title addon to the subject
   *
   * @param {string} addon - The addon to be appended to the page title. Can be a string or null to
   *
   * @developer Abhisek Dhua
   */
  public setPageTitleAddon(addon: string | null): void {
    this._titleAddonSubject.next(addon);
  }
}

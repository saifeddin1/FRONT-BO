import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';


@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private _pusher: any;
    
    constructor() {
      this._pusher = new Pusher('ceaa99c4766cab32c8ed', {
        cluster: 'eu'
      });
    }
    // any time it is needed we simply call this method
    getPusher() {
      return this._pusher;
    }
    
}

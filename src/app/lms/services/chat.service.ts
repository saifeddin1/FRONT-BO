import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // socket.io socket instance
  socket: any;

  constructor(private http: HttpClient) {
    this.socket = io(environment.LmsApiUrl + '/', {
      autoConnect: false,
    });
  }

  /**
   * Manually inits socket connection
   * @param id id of current user
   */
  init(id: string): void {
    this.socket.open();
    this.socket.emit('serverconn', id);
  }

  /**
   * Manually closes socket connection
   */
  destroy(): void {
    this.socket.close();
  }

  /**
   * Get Socket instance (may be used for custom listeners)
   */
  getSocket(): any {
    return this.socket;
  }

  /**
   * Send Message Function
   * @param message from, time, date
   * @param chatId  id of the chat
   */
  sendMessage(message: any, chatId: string): void {
    this.socket.emit('message', chatId, message);
  }

  postNewChat(from: string, to: string): Observable<Chat> {
    return this.http.post<Chat>(`${environment.LmsApiUrl}/api/chat`, { from, to });
  }

  /**
   * GET chat by id
   * @param chatId id of Chat
   * @return Observable chat instance
   */
  getChat(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${environment.LmsApiUrl}/api/chat/${chatId}`);
  }

  /**
   * GET find by members
   * @param from mesasge sender
   * @param to message reciever
   * @return Observable chat instance
   */
  findChat(from: string, to: string): Observable<Chat> {
    return this.http.get<Chat>(`${environment.LmsApiUrl}/api/chat/find/${from}/${to}`);
  }
}

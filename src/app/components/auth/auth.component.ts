
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

  @Output() public UserChanging = new EventEmitter();

	username: string;
	password: string;
  isAuthenticated: boolean;

  constructor(private authService: AuthService, private sessionService: SessionService) { }

  ngOnInit() {
    this.username = "Voljka";
    this.password = "13";
  }

  private getUserData() {
  	let userData = {
  		username: this.username,
  		password: this.password,
  	}
  	return userData;
  }

  onLogin(){
    console.log('login function');
  	this.authService.login(this.getUserData())
  		.subscribe( res => this.dealWithResult(res))
  }

  onWelcome(){
    console.log('welcome function');

    this.authService.welcome()
      .subscribe( res => console.log(res))
  }

  onLogout(){

    this.authService.unsetUser();
    this.UserChanging.emit(this.authService.currentUser());

    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.password = "";
    this.sessionService.token = undefined;
  }

  private dealWithResult(res) {
    if (res.status > 300) {
      console.log(res);
      this.showAuthError(res);
    } else {
      console.log(res);
      this.updateUserInterface(res);
    }
  }

  private showAuthError(res) {
    alert(res.msg)
  }

  private updateUserInterface(res) {

    var newUser = {
      role: res.role,
      id_token: res.id_token,
      username: res.name
    };

    this.authService.setUser(newUser);

    this.UserChanging.emit(newUser);
    this.isAuthenticated = true; 
    localStorage.setItem('token', res.id_token);
    this.sessionService.token = res.id_token;
  }

}

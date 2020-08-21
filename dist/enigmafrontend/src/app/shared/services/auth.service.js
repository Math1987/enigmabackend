"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const core_1 = require("@angular/core");
const environment_1 = require("../../../environments/environment");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Auth.Service work with JWT token sent from backend.
 * Manage signIn and signOut
 * It store the user's token at local value and refresh it with the timer (all 5 minutes)
 * If token is not good at refresh, send the user in connection's route
 */
let AuthService = (AuthService_1 = class AuthService {
  /**
   * AuthService is build from main app component
   * @param http: call backend api for tokens in signIn, signUp, or refreshToken methods
   * @param router: used to redirect user on connection page if auth fail
   */
  constructor(http, router) {
    this.http = http;
    this.router = router;
    /**
     * the jwtToken is dynamically used with a BehaviorSubject,
     * dirrectly used in player's components to get status of connection
     * (if user is not connected, kik him out of game with router)
     */
    this.jwtToken = new rxjs_1.BehaviorSubject({
      isAuthenticated: null,
      token: null,
    });
    this.initToken();
    //this.subscription = this.initTimer();
  }
  /**
   * init token check local storage to get token.
   * If got a token, put it in jwtToken observable,
   * else set observable jwt to null and navigate to connection
   */
  initToken() {
    const token = localStorage.getItem(AuthService_1.LOCAL_JWT);
    if (token) {
      this.jwtToken.next({
        isAuthenticated: true,
        token: token,
      });
    } else {
      // this.jwtToken.next({
      //   isAuthenticated: false,
      //   token: null,
      // });
      // this.router.navigate(["connexion"]);
    }
  }
  /**
   * initTimer run a timer to refresh token every 5 minutes.
   * Call to backend a new token. If done, update jwtToken observable for all
   * Else, kik off, go back to connexion route
   */
  // initTimer() {
  //   return rxjs_1
  //     .timer(30000, 15000)
  //     .pipe(
  //       operators_1.switchMap(() => {
  //         if (localStorage.getItem(AuthService_1.LOCAL_JWT)) {
  //           return this.http
  //             .get(`${environment_1.environment.apiURL}/refreshToken`)
  //             .pipe(
  //               operators_1.tap((token) => {
  //                 this.jwtToken.next({
  //                   isAuthenticated: true,
  //                   token,
  //                 });
  //                 localStorage.setItem(AuthService_1.LOCAL_JWT, token);
  //               })
  //             );
  //         } else {
  //           this.router.navigate(["connexion"]);
  //           return rxjs_1.of(null);
  //         }
  //       })
  //     )
  //     .subscribe(
  //       () => {},
  //       (err) => {
  //         this.jwtToken.next({
  //           isAuthenticated: false,
  //           token: null,
  //         });
  //         localStorage.removeItem(AuthService_1.LOCAL_JWT);
  //         if (this.subsciption) {
  //           this.subscription.unsubscribe();
  //         }
  //       }
  //     );
  // }
  refreshToken() {
    return this.http
      .get(`${environment_1.environment.apiURL}/refreshToken`)
      .pipe(
        operators_1.tap((token) => {
          if (token) {
            this.jwtToken.next({
              isAuthenticated: true,
              token: token,
            });
            localStorage.setItem(AuthService_1.LOCAL_JWT, token);
          } else {
            this.jwtToken.next({
              isAuthenticated: false,
              token: null,
            });
            localStorage.setItem(AuthService_1.LOCAL_JWT, token);
          }
        })
      );
  }
  newToken(values) {
    return this.http
      .post(`${environment_1.environment.apiURL}/newToken`, values)
      .pipe(
        operators_1.tap((token) => {
          if (token) {
            this.jwtToken.next({
              isAuthenticated: true,
              token: token,
            });
            localStorage.setItem(AuthService_1.LOCAL_JWT, token);
          } else {
            this.jwtToken.next({
              isAuthenticated: false,
              token: null,
            });
            localStorage.setItem(AuthService_1.LOCAL_JWT, token);
          }
        })
      );
  }
  /**
   * signIn: call the backend signin, responding with a token
   * if email and password are valid. Then update jwtToken observable for all
   * and store it in local storage to get it with refresh or reconnection (before expired 15minutes)
   * @param credentials: the user informations necessary for sign in the app
   */
  signIn(credentials) {
    return this.http
      .post(`${environment_1.environment.apiURL}/signin`, credentials)
      .pipe(
        operators_1.tap((token) => {
          localStorage.setItem(AuthService_1.LOCAL_JWT, token);
          this.jwtToken.next({
            isAuthenticated: true,
            token,
          });
        })
      );
  }
  /**
   * ssignUp call api backend to create a new user in database
   */
  signUp(user) {
    return this.http.post(`${environment_1.environment.apiURL}/signup`, user);
  }
  /**
   * logout clear token in local storage, and put jwtToken observable to null.
   * Navigate to connection page
   */
  logout() {
    localStorage.removeItem(AuthService_1.LOCAL_JWT);
    this.jwtToken.next({
      isAuthenticated: false,
      token: null,
    });
    this.router.navigate(["connexion"]);
    window.location.reload();
  }
});
/**
 * LOCAL_JWT is just the name used to store the token in local.
 * To avoid confusion, the name of enigmaDDR is mentioned
 */
AuthService.LOCAL_JWT = "enigmaJDR_jwt";
AuthService = AuthService_1 = __decorate(
  [
    core_1.Injectable({
      providedIn: "root",
    }),
  ],
  AuthService
);
exports.AuthService = AuthService;

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  genders = ['male', 'female', 'other'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];
  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.userValidator.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.emailValidator.bind(this))
      }),
      'gender': new FormControl('female'),
      'hobbies': new FormArray([])
    });
/*     this.signupForm.valueChanges.subscribe((value) => {
      console.log(value);
    }); */
    this.signupForm.statusChanges.subscribe((status) => console.log(status));
    this.signupForm.patchValue({'userData': {
      'username': 'Max'
    }});
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  userValidator(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return{nameIsForbidden: true};
    }
    return null;
  }

  emailValidator(control: FormControl): Promise<any> | Observable<any> {
    const observable = new Observable((observer: Observer<any>) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          observer.next({emailIsForbidden: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 3000);
    });
    return observable;
  }

}

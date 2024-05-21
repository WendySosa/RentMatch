import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {}

  async submit() {
    if(this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.signIn(this.form.value as User).then((res) => {
        console.log(res);
      }).catch(error => {
        console.log(error);
        
        let msjLoginFirebase= error.message;
        let msjLoginFinal = msjLoginFirebase == "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." ? "Credenciales invalidas" : error.message;

        this.utilsSvc.presentToast({
          message: msjLoginFinal,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert.circle.outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }
}

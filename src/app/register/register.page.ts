import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event } from '../Models/Events';
import { StorageService } from '../storage.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private navCtrl: NavController,
    private toastController: ToastController
    ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      address: [''],
    });
  }
  async logForm() {
    console.log(this.userForm.value);
    let toastMessage = ""
    if (this.userForm.valid) {
      const data = {
        name : this.userForm.get("name").value,
        phone : this.userForm.get("phone").value,
        address : this.userForm.get("address").value
      };
      this.storageService.addToStorage(data);
      this.navCtrl.pop();
      toastMessage = "Exito";
    } else {
      toastMessage = "No es valido el registro";
    }

    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }
  ngOnInit() {
  }

  register() {
    // Implement Phone Athetication
  }

}

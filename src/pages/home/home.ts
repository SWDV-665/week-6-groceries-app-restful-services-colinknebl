import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";

import { GroceryItem } from "../../models/GroceryItem";
import { GroceriesServiceProvider } from "../../providers/groceries-service/groceries-service";
import { InputDialogServiceProvider } from "../../providers/input-dialog-service/input-dialog-service";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public _groceries: GroceryItem[] = [];

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public groceriesService: GroceriesServiceProvider,
    public inputService: InputDialogServiceProvider,
    private socialSharing: SocialSharing
  ) {
    groceriesService.dataChanged$.subscribe(() => {
      this.loadItems();
    });
  }

  public get groceries(): GroceryItem[] {
    return this._groceries;
  }
  ionViewDidLoad() {
    this.loadItems();
  }

  public loadItems() {
    this.groceriesService.getItems().subscribe(
      items => (this._groceries = items),
      error => console.error(error)
    );
  }

  public removeItem(item: GroceryItem, itemIndex: number): void {
    this.groceriesService.removeItem(item);
    this._presentToast(item.name);
  }

  private _presentToast(itemName: string): void {
    this.toastCtrl
      .create({
        message: `${itemName} removed successfully`,
        duration: 3000
      })
      .present();
  }

  public addItem(): void {
    this.inputService.showPrompt();
  }

  public editItem(item: GroceryItem, itemIndex: number): void {
    this.inputService.showPrompt(item, itemIndex);
  }

  public shareItem(item: GroceryItem, itemIndex: number): void {
    const message = `Grocery Item: ${item.name} - Quantity: ${item.quantity}`;

    this.socialSharing
      .share(message, item.name.toUpperCase())
      .then(() => {
        console.log("shared successfully!");
      })
      .catch(e => console.error(e));
  }
}

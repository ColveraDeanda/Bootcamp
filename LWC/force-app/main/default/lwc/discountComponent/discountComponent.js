import { LightningElement, track, api } from 'lwc';

export default class DiscountComponent extends LightningElement {


    @api recordId;
    @track isModalOpen = false;


    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }

}
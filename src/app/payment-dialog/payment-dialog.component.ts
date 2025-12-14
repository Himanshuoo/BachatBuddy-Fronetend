import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent {
    @Input() mode: 'UPI' | 'Card' = 'UPI';
    @Output() confirm = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    upiId: string = '';

    cardDetails = {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    };

    submit() {
        if (this.mode === 'UPI') {
            if (!this.upiId.includes('@')) {
                alert('Please enter a valid UPI ID (e.g. user@upi)');
                return;
            }
            this.confirm.emit({ upiId: this.upiId });
        } else if (this.mode === 'Card') {
            if (this.cardDetails.number.length < 16 || this.cardDetails.cvv.length < 3) {
                alert('Please enter valid card details');
                return;
            }
            this.confirm.emit(this.cardDetails);
        }
    }

    close() {
        this.cancel.emit();
    }
}

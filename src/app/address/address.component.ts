import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  addresses: any[] = [];
  loading = true;
  form: FormGroup;
  editingId: string | null = null;
  error: string | null = null;
  message: string | null = null;

  get f() { return this.form.controls; }

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      this.error = 'Login required';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }
    this.load(uid);
  }

  load(uid: string): void {
    this.loading = true;
    this.addressService.getAddresses(uid).subscribe({
      next: (data) => {
        this.addresses = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Could not load addresses';
        this.loading = false;
        console.error('Address fetch error:', err);
      }
    });
  }

  startEdit(addr: any): void {
    this.editingId = addr.id;
    this.form.patchValue(addr);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const uid = sessionStorage.getItem('uid');
    if (!uid) return;

    const payload = this.form.value;

    if (this.editingId) {
      this.addressService.updateAddress(this.editingId, payload).subscribe({
        next: () => {
          this.message = 'Address updated successfully!';
          this.cancelEdit();
          this.load(uid);
        },
        error: (e) => {
          console.error('Update error:', e);
          this.error = 'Failed to update address';
        }
      });
    } else {
      this.addressService.addAddress(uid, payload).subscribe({
        next: () => {
          this.message = 'Address added successfully!';
          this.form.reset();

          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.load(uid);
          }
        },
        error: (e) => {
          console.error('Add error:', e);
          this.error = 'Failed to add address';
        }
      });
    }
  }

  deleteAddress(id: string): void {
    const uid = sessionStorage.getItem('uid');
    if (!uid) return;

    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.message = 'Address deleted successfully!';
        this.load(uid);
      },
      error: (e) => {
        console.error('Delete error:', e);
        this.error = 'Failed to delete address';
      }
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
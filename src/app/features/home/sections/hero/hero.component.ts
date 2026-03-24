import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { SeoService } from '../../../../core/services/seo.service';
import { MOCK_ROOMS } from '../../../../mock/rooms.mock';
import { BookingStore } from '../../../../store/booking.store';

function createBookingDateRangeValidator(booking: BookingService): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const g = group as FormGroup;
    const checkIn = g.get('checkIn')?.value as string;
    const checkOut = g.get('checkOut')?.value as string;
    if (!checkIn || !checkOut) {
      return null;
    }
    return booking.validateBookingDates(checkIn, checkOut) ? null : { bookingDatesInvalid: true };
  };
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly seo = inject(SeoService);
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly parallaxEnabled = signal(false);
  readonly guestCapacityError = signal<string | null>(null);

  readonly rooms = MOCK_ROOMS;
  readonly minStayNights = this.bookingService.getMinimumStay();
  readonly todayIso = this.toIsoDate(new Date());
  readonly adultsOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly childrenOptions = Array.from({ length: 11 }, (_, i) => i);

  readonly form: FormGroup = this.fb.group(
    {
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      adults: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      children: [0, [Validators.min(0), Validators.max(10)]],
      roomId: ['', Validators.required],
    },
    { validators: createBookingDateRangeValidator(this.bookingService) },
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.parallaxEnabled.set(true);
      void import('aos').then((mod) => mod.default.refresh());
    });
  }

  ngOnInit(): void {
    this.seo.updateMeta(
      'B&B — Benvenuto',
      'Prenota il tuo soggiorno in un bed & breakfast elegante: camere curate, colazione inclusa e accoglienza autentica.',
      'https://picsum.photos/seed/bnb-hero/1200/630',
    );
  }

  showDateRangeError(): boolean {
    const c = this.form;
    return (
      !!c.errors?.['bookingDatesInvalid'] &&
      (c.get('checkIn')?.touched ?? false) &&
      (c.get('checkOut')?.touched ?? false)
    );
  }

  openDatePicker(input: HTMLInputElement): void {
    input.focus();
    input.showPicker?.();
  }

  private toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onSubmit(): void {
    this.guestCapacityError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue() as {
      checkIn: string;
      checkOut: string;
      adults: number;
      children: number;
      roomId: string;
    };
    const room = this.rooms.find((r) => r.id === Number(v.roomId));
    const guests = Number(v.adults) + Number(v.children);
    if (room && guests > room.maxGuests) {
      this.guestCapacityError.set(
        `Per ${room.name} il numero massimo di ospiti è ${room.maxGuests}.`,
      );
      return;
    }
    this.store.checkIn.set(v.checkIn);
    this.store.checkOut.set(v.checkOut);
    this.store.guests.set(guests);
    this.store.selectedRoom.set(room ?? null);
    void this.router.navigate(['/prenota']);
  }
}

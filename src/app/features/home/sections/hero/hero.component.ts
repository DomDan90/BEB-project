import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { minCheckoutStructFromCheckInIso, todayNgbStruct } from '../../../../core/booking-date/booking-date-struct.util';
import { ngbPopperMatchReferenceWidth } from '../../../../core/booking-date/ngb-popper-match-reference';
import { BookingService } from '../../../../core/services/booking.service';
import { SeoService } from '../../../../core/services/seo.service';
import { MOCK_ROOMS } from '../../../../mock/rooms.mock';
import { ISCHIA_HERO_OG } from '../../../../core/media/ischia-media';
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
  imports: [ReactiveFormsModule, NgbDatepickerModule, NgbDropdownModule, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bookingService = inject(BookingService);
  private readonly seo = inject(SeoService);
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);

  readonly parallaxEnabled = signal(false);
  readonly guestCapacityError = signal<string | null>(null);

  readonly rooms = MOCK_ROOMS;
  readonly minStayNights = this.bookingService.getMinimumStay();
  readonly todayStruct: NgbDateStruct = todayNgbStruct();
  readonly adultsOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly childrenOptions = Array.from({ length: 11 }, (_, i) => i);

  readonly popperMatchReferenceWidth = ngbPopperMatchReferenceWidth;

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
    this.form
      .get('checkIn')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const ci = this.form.get('checkIn')?.value as string;
        const co = this.form.get('checkOut')?.value as string;
        if (!co) {
          return;
        }
        if (!ci || !this.bookingService.validateBookingDates(ci, co)) {
          this.form.patchValue({ checkOut: '' }, { emitEvent: false });
        }
      });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.parallaxEnabled.set(true);
      void import('aos').then((mod) => mod.default.refresh());
    });

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateSeo());
  }

  ngOnInit(): void {
    this.updateSeo();
  }

  private updateSeo(): void {
    this.translate.get(['seo.homeTitle', 'seo.homeDesc']).subscribe((t) => {
      this.seo.updateMeta(t['seo.homeTitle'], t['seo.homeDesc'], ISCHIA_HERO_OG);
    });
  }

  showDateRangeError(): boolean {
    const c = this.form;
    return (
      !!c.errors?.['bookingDatesInvalid'] &&
      (c.get('checkIn')?.touched ?? false) &&
      (c.get('checkOut')?.touched ?? false)
    );
  }

  minCheckOutDate(): NgbDateStruct {
    const checkIn = this.form.get('checkIn')?.value as string;
    return minCheckoutStructFromCheckInIso(checkIn, this.minStayNights);
  }

  roomLabel(): string {
    const id = this.form.get('roomId')?.value as string;
    if (!id) {
      return this.translate.instant('common.select');
    }
    const room = this.rooms.find((r) => r.id === Number(id));
    return room ? this.translate.instant(room.name) : this.translate.instant('common.select');
  }

  selectRoom(roomId: number): void {
    this.form.patchValue({ roomId: String(roomId) });
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
        this.translate.instant('hero.errCapacity', {
          room: this.translate.instant(room.name),
          max: room.maxGuests,
        }),
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoadingComponent } from './loading.component';
import { LoadingService } from '../../services/loading.service';

describe('LoadingComponent', () => {
  let fixture: ComponentFixture<LoadingComponent>;
  let component: LoadingComponent;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      providers: [
        LoadingService
      ]
    }).compileComponents();

    loadingService = TestBed.inject(LoadingService);
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(LoadingComponent);
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should show the loading indicator', () => {
    loadingService.active = true;
    fixture.detectChanges();
    expect(component.active).toBeTruthy();
    let element = fixture.debugElement.queryAll(By.css('.loader'));
    expect(element.length).toBe(1);
    loadingService.active = false;
    fixture.detectChanges();
    expect(component.active).toBeFalsy();
    element = fixture.debugElement.queryAll(By.css('.loader'));
    expect(element.length).toBe(0);
  });
});

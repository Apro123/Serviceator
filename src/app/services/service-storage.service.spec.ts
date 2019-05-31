import { TestBed } from '@angular/core/testing';

import { ServiceStorageService } from './service-storage.service';

describe('ServiceStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceStorageService = TestBed.get(ServiceStorageService);
    expect(service).toBeTruthy();
  });
});

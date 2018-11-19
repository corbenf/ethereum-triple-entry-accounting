import { TestBed, inject } from '@angular/core/testing';

import { MongoApiService } from './mongo-api.service';

describe('MongoApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MongoApiService]
    });
  });

  it('should be created', inject([MongoApiService], (service: MongoApiService) => {
    expect(service).toBeTruthy();
  }));
});

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { IProduct } from '../../interfaces/product.interface';
import { MongoApiService } from 'src/app/mongo-api.service';
import { GlobalsService } from 'src/app/globals.service';

/**
 * Data source for the InventoryTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class InventoryTableDataSource extends DataSource<IProduct> {

  constructor(private gb: GlobalsService, private api: MongoApiService) {
    super();
    
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<IProduct[]> {
    return this.api.getUsersInventory(this.gb.currentUser._id);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
}

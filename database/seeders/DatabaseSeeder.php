<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Generated from the original src/data/dummyData.js (same IDs, same values).
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['UserID' => 1, 'UserName' => 'admin', 'Password' => 'admin123', 'Role' => 'Admin'],
            ['UserID' => 2, 'UserName' => 'juan', 'Password' => 'juan123', 'Role' => 'Warehouse Staff'],
            ['UserID' => 3, 'UserName' => 'maria', 'Password' => 'maria123', 'Role' => 'Purchasing Manager'],
            ['UserID' => 4, 'UserName' => 'pedro', 'Password' => 'pedro123', 'Role' => 'Sales Staff'],
        ];
        foreach ($users as $u) {
            $u['Password'] = Hash::make($u['Password']);
            DB::table('users')->insert($u);
        }

        DB::table('suppliers')->insert([
            ['SuppliersID' => 1, 'SupplierName' => 'CoolAir Manufacturing Corp.', 'ContactPerson' => 'Ramon Bautista', 'Phone' => '0917-123-4567', 'Email' => 'ramon.bautista@coolair.ph', 'Address' => 'Km 45 National Highway, Calamba, Laguna'],
            ['SuppliersID' => 2, 'SupplierName' => 'ThermoTech Distribution Inc.', 'ContactPerson' => 'Angela Cruz', 'Phone' => '0918-234-5678', 'Email' => 'angela.cruz@thermotech.ph', 'Address' => 'Unit 12, FTI Complex, Taguig City'],
            ['SuppliersID' => 3, 'SupplierName' => 'PureAir Solutions', 'ContactPerson' => 'Michael Tan', 'Phone' => '0919-345-6789', 'Email' => 'michael.tan@pureairsolutions.ph', 'Address' => '88 Aguinaldo Highway, Dasmariñas, Cavite'],
            ['SuppliersID' => 4, 'SupplierName' => 'FilterPro Supplies', 'ContactPerson' => 'Liza Fernandez', 'Phone' => '0920-456-7890', 'Email' => 'liza.fernandez@filterpro.ph', 'Address' => '23 Purok 5, Majayjay, Laguna'],
        ]);
        DB::table('categories')->insert([
            ['CategoryID' => 1, 'CategoryName' => 'Class A Seasonal', 'InventoryStrategy' => 'Pre-Season Order'],
            ['CategoryID' => 2, 'CategoryName' => 'Class A Regular', 'InventoryStrategy' => 'Standard ROP'],
            ['CategoryID' => 3, 'CategoryName' => 'Class B Regular', 'InventoryStrategy' => 'Standard ROP'],
            ['CategoryID' => 4, 'CategoryName' => 'Class C Perishable', 'InventoryStrategy' => 'FIFO'],
        ]);
        DB::table('products')->insert([
            ['ProductID' => 1, 'ProductName' => 'Portable AC Units', 'SuppliersID' => 1, 'CategoryID' => 1, 'UnitCost' => 9500, 'SellingPrice' => 14500, 'CurrentStock' => 150, 'ReorderStock' => 377, 'SafetyStock' => 50, 'MaxStock' => 6000, 'Seasonal' => true, 'Location' => 'Aisle A - Shelf 1 - Bin 1'],
            ['ProductID' => 2, 'ProductName' => 'Smart Thermostats', 'SuppliersID' => 2, 'CategoryID' => 2, 'UnitCost' => 3200, 'SellingPrice' => 5800, 'CurrentStock' => 45, 'ReorderStock' => 83, 'SafetyStock' => 13, 'MaxStock' => 500, 'Seasonal' => false, 'Location' => 'Aisle B - Shelf 1 - Bin 1'],
            ['ProductID' => 3, 'ProductName' => 'Air Purifiers', 'SuppliersID' => 3, 'CategoryID' => 3, 'UnitCost' => 4200, 'SellingPrice' => 6800, 'CurrentStock' => 80, 'ReorderStock' => 45, 'SafetyStock' => 10, 'MaxStock' => 300, 'Seasonal' => false, 'Location' => 'Aisle B - Shelf 2 - Bin 1'],
            ['ProductID' => 4, 'ProductName' => 'Replacement Filters', 'SuppliersID' => 4, 'CategoryID' => 4, 'UnitCost' => 180, 'SellingPrice' => 350, 'CurrentStock' => 120, 'ReorderStock' => 100, 'SafetyStock' => 30, 'MaxStock' => 1000, 'Seasonal' => false, 'Location' => 'Aisle C - Shelf 1 - Bin 1'],
            ['ProductID' => 5, 'ProductName' => 'Electric Fans (Stand)', 'SuppliersID' => 1, 'CategoryID' => 1, 'UnitCost' => 1500, 'SellingPrice' => 3200, 'CurrentStock' => 200, 'ReorderStock' => 80, 'SafetyStock' => 20, 'MaxStock' => 800, 'Seasonal' => true, 'Location' => 'Aisle A - Shelf 2 - Bin 1'],
            ['ProductID' => 6, 'ProductName' => 'Electric Fans (Desk)', 'SuppliersID' => 1, 'CategoryID' => 3, 'UnitCost' => 800, 'SellingPrice' => 1800, 'CurrentStock' => 95, 'ReorderStock' => 50, 'SafetyStock' => 15, 'MaxStock' => 400, 'Seasonal' => false, 'Location' => 'Aisle A - Shelf 2 - Bin 2'],
            ['ProductID' => 7, 'ProductName' => 'Ceiling Fans', 'SuppliersID' => 2, 'CategoryID' => 2, 'UnitCost' => 2200, 'SellingPrice' => 4500, 'CurrentStock' => 60, 'ReorderStock' => 40, 'SafetyStock' => 10, 'MaxStock' => 200, 'Seasonal' => false, 'Location' => 'Aisle D - Shelf 1 - Bin 1'],
            ['ProductID' => 8, 'ProductName' => 'Air Purifier HEPA Filters', 'SuppliersID' => 4, 'CategoryID' => 4, 'UnitCost' => 220, 'SellingPrice' => 450, 'CurrentStock' => 80, 'ReorderStock' => 60, 'SafetyStock' => 20, 'MaxStock' => 500, 'Seasonal' => false, 'Location' => 'Aisle C - Shelf 2 - Bin 1'],
        ]);
        DB::table('batches')->insert([
            ['BatchID' => 12, 'ProductID' => 1, 'Quantity' => 100, 'RemainingStock' => 0, 'PurchaseDate' => '2026-03-01', 'ExpirationDate' => null, 'Status' => 'depleted', 'Location' => 'Aisle A - Shelf 1 - Bin 1'],
            ['BatchID' => 1, 'ProductID' => 1, 'Quantity' => 300, 'RemainingStock' => 150, 'PurchaseDate' => '2026-05-01', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle A - Shelf 1 - Bin 1'],
            ['BatchID' => 2, 'ProductID' => 2, 'Quantity' => 60, 'RemainingStock' => 45, 'PurchaseDate' => '2026-06-01', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle B - Shelf 1 - Bin 1'],
            ['BatchID' => 3, 'ProductID' => 3, 'Quantity' => 100, 'RemainingStock' => 80, 'PurchaseDate' => '2026-06-10', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle B - Shelf 2 - Bin 1'],
            ['BatchID' => 4, 'ProductID' => 4, 'Quantity' => 50, 'RemainingStock' => 0, 'PurchaseDate' => '2026-02-01', 'ExpirationDate' => '2026-07-01', 'Status' => 'expired', 'Location' => 'Aisle C - Shelf 1 - Bin 1'],
            ['BatchID' => 5, 'ProductID' => 4, 'Quantity' => 100, 'RemainingStock' => 70, 'PurchaseDate' => '2026-07-15', 'ExpirationDate' => '2026-09-20', 'Status' => 'active', 'Location' => 'Aisle C - Shelf 1 - Bin 1'],
            ['BatchID' => 6, 'ProductID' => 4, 'Quantity' => 50, 'RemainingStock' => 50, 'PurchaseDate' => '2026-08-01', 'ExpirationDate' => '2026-12-01', 'Status' => 'active', 'Location' => 'Aisle C - Shelf 1 - Bin 1'],
            ['BatchID' => 7, 'ProductID' => 5, 'Quantity' => 250, 'RemainingStock' => 200, 'PurchaseDate' => '2026-04-01', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle A - Shelf 2 - Bin 1'],
            ['BatchID' => 8, 'ProductID' => 6, 'Quantity' => 120, 'RemainingStock' => 95, 'PurchaseDate' => '2026-05-15', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle A - Shelf 2 - Bin 2'],
            ['BatchID' => 9, 'ProductID' => 7, 'Quantity' => 80, 'RemainingStock' => 60, 'PurchaseDate' => '2026-06-20', 'ExpirationDate' => null, 'Status' => 'active', 'Location' => 'Aisle D - Shelf 1 - Bin 1'],
            ['BatchID' => 10, 'ProductID' => 8, 'Quantity' => 60, 'RemainingStock' => 30, 'PurchaseDate' => '2026-06-01', 'ExpirationDate' => '2026-09-10', 'Status' => 'active', 'Location' => 'Aisle C - Shelf 2 - Bin 1'],
            ['BatchID' => 11, 'ProductID' => 8, 'Quantity' => 50, 'RemainingStock' => 50, 'PurchaseDate' => '2026-07-20', 'ExpirationDate' => '2026-11-15', 'Status' => 'active', 'Location' => 'Aisle C - Shelf 2 - Bin 1'],
        ]);
        DB::table('transactions')->insert([
            ['TransactionID' => 1, 'ProductID' => 1, 'BatchID' => 12, 'TransactionType' => 'PURCHASE', 'Quantity' => 100, 'TransactionDate' => '2026-03-01', 'PerformedBy' => 'maria', 'Notes' => 'Initial pre-season stock'],
            ['TransactionID' => 2, 'ProductID' => 1, 'BatchID' => 1, 'TransactionType' => 'PURCHASE', 'Quantity' => 300, 'TransactionDate' => '2026-05-01', 'PerformedBy' => 'maria', 'Notes' => 'Pre-season restock'],
            ['TransactionID' => 3, 'ProductID' => 1, 'BatchID' => 12, 'TransactionType' => 'SALE', 'Quantity' => 100, 'TransactionDate' => '2026-08-10', 'PerformedBy' => 'pedro', 'Notes' => 'Bulk sale to retailer'],
            ['TransactionID' => 4, 'ProductID' => 1, 'BatchID' => 1, 'TransactionType' => 'SALE', 'Quantity' => 150, 'TransactionDate' => '2026-08-20', 'PerformedBy' => 'pedro', 'Notes' => 'Retail counter sales'],
            ['TransactionID' => 5, 'ProductID' => 2, 'BatchID' => 2, 'TransactionType' => 'PURCHASE', 'Quantity' => 60, 'TransactionDate' => '2026-06-01', 'PerformedBy' => 'maria', 'Notes' => 'Thermostat restock'],
            ['TransactionID' => 6, 'ProductID' => 2, 'BatchID' => 2, 'TransactionType' => 'SALE', 'Quantity' => 15, 'TransactionDate' => '2026-08-25', 'PerformedBy' => 'pedro', 'Notes' => 'Smart home bundle sale'],
            ['TransactionID' => 7, 'ProductID' => 3, 'BatchID' => 3, 'TransactionType' => 'PURCHASE', 'Quantity' => 100, 'TransactionDate' => '2026-06-10', 'PerformedBy' => 'maria', 'Notes' => 'Air purifier stock'],
            ['TransactionID' => 8, 'ProductID' => 3, 'BatchID' => 3, 'TransactionType' => 'SALE', 'Quantity' => 20, 'TransactionDate' => '2026-08-15', 'PerformedBy' => 'pedro', 'Notes' => 'Allergy season sales'],
            ['TransactionID' => 9, 'ProductID' => 4, 'BatchID' => 4, 'TransactionType' => 'EXPIRED', 'Quantity' => 50, 'TransactionDate' => '2026-07-05', 'PerformedBy' => 'juan', 'Notes' => 'Expired filter batch disposed'],
            ['TransactionID' => 10, 'ProductID' => 4, 'BatchID' => 5, 'TransactionType' => 'SALE', 'Quantity' => 30, 'TransactionDate' => '2026-08-22', 'PerformedBy' => 'pedro', 'Notes' => 'Filter replacement sales'],
            ['TransactionID' => 11, 'ProductID' => 5, 'BatchID' => 7, 'TransactionType' => 'SALE', 'Quantity' => 50, 'TransactionDate' => '2026-08-18', 'PerformedBy' => 'pedro', 'Notes' => 'Fan promo sale'],
            ['TransactionID' => 12, 'ProductID' => 6, 'BatchID' => 8, 'TransactionType' => 'RETURN', 'Quantity' => 10, 'TransactionDate' => '2026-08-27', 'PerformedBy' => 'juan', 'Notes' => 'Customer return - unused desk fan'],
            ['TransactionID' => 13, 'ProductID' => 7, 'BatchID' => 9, 'TransactionType' => 'SALE', 'Quantity' => 20, 'TransactionDate' => '2026-08-12', 'PerformedBy' => 'pedro', 'Notes' => 'Ceiling fan installation sale'],
            ['TransactionID' => 14, 'ProductID' => 8, 'BatchID' => 10, 'TransactionType' => 'RETURN', 'Quantity' => 5, 'TransactionDate' => '2026-08-28', 'PerformedBy' => 'juan', 'Notes' => 'Customer return - unopened HEPA filter'],
        ]);
        DB::table('orders')->insert([
            ['OrderID' => 1, 'CustomerName' => 'ABC Hardware Store', 'OrderDate' => '2026-08-20', 'Status' => 'Received'],
            ['OrderID' => 2, 'CustomerName' => 'Juan Dela Cruz', 'OrderDate' => '2026-08-22', 'Status' => 'Pending'],
            ['OrderID' => 3, 'CustomerName' => 'CoolBreeze Retail', 'OrderDate' => '2026-08-15', 'Status' => 'Received'],
            ['OrderID' => 4, 'CustomerName' => 'Maria Santos', 'OrderDate' => '2026-08-25', 'Status' => 'Pending'],
            ['OrderID' => 5, 'CustomerName' => 'Home Depot Cabuyao', 'OrderDate' => '2026-08-10', 'Status' => 'Cancelled'],
            ['OrderID' => 6, 'CustomerName' => 'Pedro Reyes', 'OrderDate' => '2026-08-27', 'Status' => 'Pending'],
            ['OrderID' => 7, 'CustomerName' => 'AllergyFree Clinic', 'OrderDate' => '2026-08-05', 'Status' => 'Failed'],
        ]);
        DB::table('order_items')->insert([
            ['OrderID' => 1, 'ProductID' => 1, 'Quantity' => 20, 'Price' => 14500],
            ['OrderID' => 2, 'ProductID' => 2, 'Quantity' => 2, 'Price' => 5800],
            ['OrderID' => 3, 'ProductID' => 5, 'Quantity' => 15, 'Price' => 3200],
            ['OrderID' => 4, 'ProductID' => 3, 'Quantity' => 1, 'Price' => 6800],
            ['OrderID' => 5, 'ProductID' => 7, 'Quantity' => 5, 'Price' => 4500],
            ['OrderID' => 6, 'ProductID' => 4, 'Quantity' => 10, 'Price' => 350],
            ['OrderID' => 7, 'ProductID' => 8, 'Quantity' => 20, 'Price' => 450],
        ]);
        DB::table('alerts')->insert([
            ['NotificationID' => 1, 'ProductID' => 2, 'NotificationType' => 'Low Stock Watch', 'NotificationMessage' => 'Smart Thermostats stock is approaching the reorder threshold.', 'NotificationDate' => '2026-08-20', 'Status' => 'Pending'],
            ['NotificationID' => 2, 'ProductID' => 3, 'NotificationType' => 'Reorder Now', 'NotificationMessage' => 'Air Purifiers have reached the reorder point.', 'NotificationDate' => '2026-08-22', 'Status' => 'Pending'],
            ['NotificationID' => 3, 'ProductID' => 2, 'NotificationType' => 'Critical', 'NotificationMessage' => 'Smart Thermostats stock is critically low, below safety stock.', 'NotificationDate' => '2026-08-26', 'Status' => 'Pending'],
            ['NotificationID' => 4, 'ProductID' => 1, 'NotificationType' => 'Overstock Warning', 'NotificationMessage' => 'Portable AC Units purchase would exceed max stock threshold.', 'NotificationDate' => '2026-08-05', 'Status' => 'Acknowledged'],
            ['NotificationID' => 5, 'ProductID' => 8, 'NotificationType' => 'Expiry Warning', 'NotificationMessage' => 'Air Purifier HEPA Filters batch is expiring within 90 days.', 'NotificationDate' => '2026-08-28', 'Status' => 'Pending'],
        ]);
    }
}
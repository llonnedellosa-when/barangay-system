<?php

use App\Http\Controllers\ResidentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
 
Route::get('/', fn() => redirect('/dashboard'));
 
Route::middleware(['auth', 'verified'])->group(function () {
 
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
 
    // Residents — full CRUD
    Route::resource('residents', ResidentController::class);
 
    // Document Generator
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/documents/generate/{docType}', [DocumentController::class, 'generate'])->name('documents.generate');
    Route::post('/documents/generate', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/print/{id}', [DocumentController::class, 'print'])->name('documents.print');
});
 
require __DIR__.'/auth.php';

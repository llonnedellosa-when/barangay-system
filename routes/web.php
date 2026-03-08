<?php

use App\Http\Controllers\ResidentController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\BlotterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect('/dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Residents
    Route::resource('residents', ResidentController::class);

    // Document Requests
    Route::resource('documents', DocumentRequestController::class);
    Route::patch('documents/{document}/status', [DocumentRequestController::class, 'updateStatus'])
         ->name('documents.status');
    Route::get('documents/{document}/print', [DocumentRequestController::class, 'print'])
         ->name('documents.print');

    // Blotter
    Route::resource('blotter', BlotterController::class);
    Route::patch('blotter/{blotter}/status', [BlotterController::class, 'updateStatus'])
         ->name('blotter.status');
});

require __DIR__.'/auth.php';
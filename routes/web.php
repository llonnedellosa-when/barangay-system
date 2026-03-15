<?php

use App\Http\Controllers\ResidentController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect('/dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Residents
    Route::resource('residents', ResidentController::class);

    // Documents
    Route::resource('documents', DocumentRequestController::class);
    Route::patch('/documents/{document}/status', [DocumentRequestController::class, 'updateStatus'])->name('documents.status');
    Route::get('/documents/{document}/print',    [DocumentRequestController::class, 'print'])->name('documents.print');

    // Blotter
    Route::resource('blotter', BlotterController::class);
    Route::patch('/blotter/{blotter}/status', [BlotterController::class, 'updateStatus'])->name('blotter.status');

});

require __DIR__.'/auth.php';
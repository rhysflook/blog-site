<?php

use App\Http\Controllers\ReadBlogController;
use App\Http\Controllers\UserBlogsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::get('/', function () {
    return view('home');
});

Route::get('/practice', function () {
    return view('practice', []);
})
    ->name('practice');

// Create page routes
Route::get('/creation', [UserBlogsController::class, 'overview']);
Route::post('/creation', [UserBlogsController::class, 'create']);
Route::put('/creation', [UserBlogsController::class, 'update']);
Route::delete('/creation/{id}', [UserBlogsController::class, 'destroy']);

// Read page routes
Route::get('/read', [ReadBlogController::class, 'getBlogs']);
Route::get('/read/{id}', [ReadBlogController::class, 'fetch'])->name('read.blog');

Route::get('/search', [ReadBlogController::class, 'find']);

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__ . '/auth.php';
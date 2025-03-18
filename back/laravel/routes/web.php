<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => ['web']], function () {
    Route::post('/getWords', [WordController::class, 'getWords']);

    Route::post('/register', [UserController::class, 'register']);

    Route::post('/login', [UserController::class, 'login']);

    Route::post('/logout', [UserController::class, 'logout']);

    Route::post('/isUserLogged', [UserController::class, 'isUserLogged']);
    
    Route::post('/getProfile', [UserController::class, 'getProfile']);

    Route::post('/getUserId', [UserController::class, 'getUserId']);

    Route::post('/getUserInfo', [UserController::class, 'getUserInfo']);  
    
    Route::post('/addCategory', [CategoryController::class, 'addCategory']);  

    Route::post('/getCategories', [CategoryController::class, 'getCategories']);  

    Route::post('/getMyCategories', [CategoryController::class, 'getMyCategories']);  

    Route::post('/editCategory', [CategoryController::class, 'editCategory']);  

    Route::post('/deleteCategory', [CategoryController::class, 'deleteCategory']);  

});
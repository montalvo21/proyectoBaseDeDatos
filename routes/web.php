<?php

use App\Http\Controllers\UsersController2;
use App\Http\Controllers\UserController;
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
    return view('welcome');
});
Route::get('/user', [UserController::class, 'index']); // Ruta para: Traer todos los datos
Route::post('/user', [UserController::class, 'store']); // Ruta para: Crear nuevo registro
Route::get('/user/{id}', [UserController::class, 'show']); // Ruta para: Mostra o traer un reg por id
Route::put('/user/{id}', [UserController::class, 'update']); // Ruta para: Modificar valores de un registro por id
Route::delete('/user/{id}', [UserController::class, 'destroy']); // Ruta para: Eliminar el registro por id

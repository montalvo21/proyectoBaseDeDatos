<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/user', [UserController::class, 'index']); // Ruta para: Traer todos los datos
Route::post('/user', [UserController::class, 'store']); // Ruta para: Crear nuevo registro
Route::get('/user/{id}', [UserController::class, 'show']); // Ruta para: Mostra o traer un reg por id
Route::put('/user/{id}', [UserController::class, 'update']); // Ruta para: Modificar valores de un registro por id
Route::delete('/user/{id}', [UserController::class, 'destroy']); // Ruta para: Eliminar el registro por id

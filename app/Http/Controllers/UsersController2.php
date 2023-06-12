<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;

class UsersController2 extends Controller
{
    public function obtenerUsuario(){
        
        $usuario= Users::all();
        $json = array(
            "status" => 200,
            "total_usuarios" => count($usuario),
            "detalle" => $usuario
        );
        return json_encode($json, true);
    }
    
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    public function checkUserDuplicated($userData)
    {
        $canCreate = true;

        $findDuplicated = User::where('email', strtolower($userData -> email))
        ->orwhere('name', strtolower($userData -> name))
        ->count();

        if ($findDuplicated != 0) {
            $canCreate = false;
        }

        return $canCreate;
    }

    public function findWhatIsDuplicated($userData)
    {
        $isDuplicated = 'name';

        $emailDuplicated = User::where('email', strtolower($userData -> email))
        ->count();

        if ($emailDuplicated != 0) {
            $isDuplicated = 'email';
        }

        return $isDuplicated;
    }

    public function register(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:20',
            'email' => 'required|string|email|max:255',
            'password' => [
                'required',
                'string',
                'min:6',             // must be at least 6 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'confirmed'
            ],
        ]);

        if ($validator->fails()) {
            $sendUser = (object) 
            ["valid" => false,
            'message' => "Validation errors."
            ];
        } else {
            $createUser = $this->checkUserDuplicated($request);

            if ($createUser) {
                $user = new User;
                $user -> name = strtolower($request -> name);
                $user -> email = strtolower($request -> email);
                $user -> password = Hash::make($request -> password);
                $user -> save();

                $request->session()->put('userId', $user -> id);
                $request->session()->save();
                $token = $user->createToken('token')->plainTextToken;
                $sendUser = (object) 
                ["valid" => true,
                'message' => $request->session()->get("userId"),
                'token' => $token
                ];
            } else {
                $duplicated = $this->findWhatIsDuplicated($request);
                $sendUser = (object) 
                ["valid" => false,
                'message' => "Name already in use."
                ];
                
                if ($duplicated == 'email') {
                    $sendUser = (object) 
                    ["valid" => false,
                    'message' => "Email already registered."
                    ];
                }
                
            }
        } 

        return response() -> json($sendUser);
    }

    public function login(Request $request)
    {   
        $sendUser = (object)
        ['valid' => false,
        'message' => "User not found.",
        'token' => null
        ];

        $userFound = User::where('email', strtolower($request -> email))->first();
        if ($userFound != null) {
            if (Hash::check($request -> password, $userFound -> password)) {
                $user = $userFound;
                $request -> session()->put('userId', $user->id);
                $token = $user->createToken('token')->plainTextToken;
                $sendUser = (object) 
                ['valid' => true,
                'message' => "Logged in successfully",
                'token' => $token
                ];

            } else {
                $sendUser = (object)
                ['valid' => false,
                'message' => "Password and e-mail don't match.",
                'token' => null
                ];
            }
        }

        return json_encode($sendUser);
    }

    public function logout(Request $request)
    {   
        [$id, $token] = explode('|', $request -> token, 2);
        
        PersonalAccessToken::find($id)->delete();

        $returnResponse = (object)['logout' => true];
        return response() -> json($returnResponse);
    }

    public function getUserId(Request $request)
    {
        $returnUserId = null;

        [$id, $token] = explode('|', $request -> token, 2);
        $accessToken = PersonalAccessToken::find($id);

        if (hash_equals($accessToken->token, hash('sha256', $token))) {
            $returnUserId = $accessToken -> tokenable_id;
            $request -> session()->put('userId', $returnUserId);
        }

        return response() -> json($returnUserId);
    }    

    public function getUserInfo(Request $request)
    {
        $returnUserId = null;
        $userFound = null;
        
        [$id, $token] = explode('|', $request -> token, 2);
        $accessToken = PersonalAccessToken::find($id);

        if (hash_equals($accessToken->token, hash('sha256', $token))) {
            $returnUserId = $accessToken -> tokenable_id;
            $request -> session()->put('userId', $returnUserId);

            $userFound = User::where('id', $returnUserId)->first();
        }

        return response() -> json($userFound);
    }    
    
    public function isUserLogged(Request $request)
    {
        $userLogged = false;

        if ($request -> token == null || $request -> token == "" || $request -> token == "null") {
            $userLogged = false;
        } else {    
        //Check if the user is logged, returns 'null' if the user is not logged in.
        [$id, $token] = explode('|', $request -> token, 2);
        $accessToken = PersonalAccessToken::find($id);

        if ($accessToken != null) {
            if (hash_equals($accessToken->token, hash('sha256', $token))) {
                $userId = $accessToken -> tokenable_id;
                $request->session()->put('userId', $userId);
                $userLogged = true;
            }
        }

        }
        return response() -> json($userLogged);
    }  
    
    public function getProfile(Request $request)
    {
        $profile = null;

        $userId = $this->getUserId($request);
        if ($userId != null) {
            $profile = User::where('id', $userId) -> first();
        }
        
        return response() -> json($profile);
    }     

}